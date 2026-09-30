"""Update original PDF text and add requested AI Switch screenshots without redesign."""
from io import BytesIO
from pathlib import Path
import json
import re
import pdfplumber
from pypdf import PdfReader, PdfWriter
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.utils import ImageReader

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'pdf/resume-content.json').read_text(encoding='utf-8'))
SOURCE = ROOT / DATA['template']
OUTPUT = ROOT / DATA['output']
OUTPUT.parent.mkdir(parents=True, exist_ok=True)
(ROOT / 'tmp/pdfs').mkdir(parents=True, exist_ok=True)
pdfmetrics.registerFont(TTFont('OriginalRegular', 'C:/Windows/Fonts/malgun.ttf'))
pdfmetrics.registerFont(TTFont('OriginalBold', 'C:/Windows/Fonts/malgunbd.ttf'))
source_layout = pdfplumber.open(SOURCE)
writer = PdfWriter(clone_from=str(SOURCE))
assert len(writer.pages) == 5
# Remove old text operators so obsolete wording is not hidden under new text.
writer.remove_text()
audit = []

def font_of(char):
    return 'OriginalBold' if 'Bold' in char['fontname'] else 'OriginalRegular'

def color_of(char):
    color = char['non_stroking_color']
    return color if isinstance(color, (tuple, list)) else (color, color, color)

def wrap(text, font, size, width):
    lines, line = [], ''
    for ch in text:
        if ch == '\n':
            lines.append(line.rstrip())
            line = ''
        elif pdfmetrics.stringWidth(line + ch, font, size) > width:
            lines.append(line.rstrip())
            line = ch.lstrip()
        else:
            line += ch
    if line:
        lines.append(line.rstrip())
    return lines

for index, (page, original) in enumerate(zip(writer.pages, source_layout.pages)):
    width, height = float(page.mediabox.width), float(page.mediabox.height)
    replacements = []

    def replace_text(old, new, *, center=None, max_width=None, tracking=0):
        matches = original.search(re.escape(old), regex=True, return_chars=True)
        assert len(matches) == 1, (index + 1, old, len(matches))
        match = matches[0]
        char = match['chars'][0]
        font, size = font_of(char), char['size']
        text_width = pdfmetrics.stringWidth(new, font, size) + max(0, len(new) - 1) * tracking
        if max_width is not None:
            assert text_width <= max_width, (new, text_width, max_width)
        replacements.append({'box': (match['x0']-.1, match['top']-.1, match['x1']+.1, match['bottom']+.1),
            'x': match['x0'] if center is None else center-text_width/2,
            'baselines': [char['matrix'][5]], 'lines': [new], 'font': font, 'size': size,
            'color': color_of(char), 'tracking': tracking})

    def replace_cell(top, bottom, text, label):
        body = [ch for ch in original.chars if 80 < ch['x0'] < 560 and top < ch['top'] < bottom]
        assert body, (top, bottom)
        char = body[0]
        font, size = font_of(char), char['size']
        baselines = sorted({round(ch['matrix'][5], 5) for ch in body}, reverse=True)
        lines = wrap(text, font, size, 559.5-81.75)
        assert len(lines) <= len(baselines), (index+1, top, len(lines), len(baselines), lines)
        replacements.append({'box': (80, top, 562, bottom), 'x': 81.75, 'baselines': baselines,
            'lines': lines, 'font': font, 'size': size, 'color': color_of(char), 'tracking': 0})
        labels = [ch for ch in original.chars if 28 < ch['x0'] < 73 and top < ch['top'] < bottom]
        assert labels
        char = labels[0]
        label_width = pdfmetrics.stringWidth(label, font_of(char), char['size'])
        replacements.append({'box': (28, top, 73, bottom), 'x': 50.625-label_width/2,
            'baselines': [char['matrix'][5]], 'lines': [label], 'font': font_of(char),
            'size': char['size'], 'color': color_of(char), 'tracking': 0})

    for change in DATA['changes']:
        if change['page'] != index + 1:
            continue
        if change['kind'] == 'text':
            options = {key: change[key] for key in ['center', 'max_width', 'tracking'] if key in change}
            replace_text(change['match'], change['text'], **options)
        else:
            replace_cell(change['top'], change['bottom'], change['text'], change['label'])

    packet = BytesIO()
    overlay = canvas.Canvas(packet, pagesize=(width,height), pageCompression=1)
    for char in original.chars:
        x,y=char['x0'],(char['top']+char['bottom'])/2
        if any(b['box'][0]<=x<=b['box'][2] and b['box'][1]<=y<=b['box'][3] for b in replacements):
            continue
        overlay.setFont(font_of(char),char['size'])
        overlay.setFillColorRGB(*color_of(char))
        overlay.drawString(char['matrix'][4],char['matrix'][5],char['text'])
    for block in replacements:
        for line,baseline in zip(block['lines'],block['baselines']):
            obj=overlay.beginText(block['x'],baseline)
            obj.setFont(block['font'],block['size'])
            obj.setFillColorRGB(*block['color'])
            obj.setCharSpace(block['tracking'])
            obj.textOut(line)
            overlay.drawText(obj)
    if index == 1:
        # Match the two-column screenshot frames used on the original project pages.
        frame_top, frame_width, frame_height = 622.5, 267.75, 141.75
        for x, filename in zip([27.375, 300.375], DATA['screenshots']):
            screenshot = ImageReader(str(ROOT / filename))
            image_width, image_height = screenshot.getSize()
            scale = min((frame_width - 1.5) / image_width, (frame_height - 1.5) / image_height)
            drawn_width, drawn_height = image_width * scale, image_height * scale
            y = height - frame_top - frame_height
            overlay.drawImage(screenshot, x + (frame_width-drawn_width)/2,
                y + (frame_height-drawn_height)/2, width=drawn_width, height=drawn_height)
            overlay.setStrokeColorRGB(.898, .9059, .9216)
            overlay.setLineWidth(.75)
            overlay.roundRect(x, y, frame_width, frame_height, 3, stroke=1, fill=0)
    overlay.save()
    packet.seek(0)
    page.merge_page(PdfReader(packet).pages[0])
    audit.append({'page':index+1,'textRegions':len(replacements),
        'originalImages':len(original.images),'addedScreenshots':2 if index == 1 else 0,
        'originalRects':len(original.rects)})

writer.add_metadata({'/Title':'천주아 | 이력서 및 웹 개발 포트폴리오','/Author':'천주아'})
writer.write(OUTPUT)
source_layout.close()
check=PdfReader(OUTPUT)
assert len(check.pages)==5
assert '약 24%' in check.pages[1].extract_text()
(ROOT/'tmp/pdfs/original-design-edit-audit.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'output':str(OUTPUT),'pages':len(check.pages),'bytes':OUTPUT.stat().st_size,'edits':audit},ensure_ascii=False))
