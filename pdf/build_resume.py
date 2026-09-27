"""Generate the resume with a dedicated page for each project in PDF and HTML."""
import json
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import BaseDocTemplate, Frame, Image, KeepTogether, PageBreak, PageTemplate, Paragraph, Spacer, Table, TableStyle

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
DATA = json.loads((HERE / 'resume-content.json').read_text(encoding='utf-8'))
OUT = ROOT / 'output' / 'pdf' / '천주아_이력서_개정본.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
for name, filename in [('Pretendard', 'Pretendard-Regular.ttf'), ('PretendardBold', 'Pretendard-Bold.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(HERE / 'fonts' / filename)))
W, H = A4
MARGIN = 40
WIDTH = W - MARGIN * 2
INK, SUB, RULE, FILL = [colors.HexColor(c) for c in ['#202020', '#555555', '#aeb0b3', '#f1f1f1']]
styles = {}


def style(name, size, leading, bold=False, **kwargs):
    styles[name] = ParagraphStyle(name, fontName='PretendardBold' if bold else 'Pretendard',
                                  fontSize=size, leading=leading, textColor=INK, **kwargs)


style('title', 23, 30, True, alignment=TA_CENTER)
style('pageTitle', 16, 23, True)
style('section', 11.5, 17, True, keepWithNext=True)
style('project', 12, 18, True)
style('caseTitle', 13.5, 20, True)
style('caseLabel', 9.5, 14, True)
style('caseBody', 10.2, 17)
style('body', 9.7, 15)
style('cell', 9.1, 13.5)
style('label', 9.1, 13.5, True, alignment=TA_CENTER)
style('period', 8.7, 13.5, alignment=TA_CENTER)
style('meta', 9, 14)
styles['meta'].textColor = SUB
style('bullet', 9.7, 15, leftIndent=8, firstLineIndent=-8)
style('cellBullet', 9.1, 13.5, leftIndent=7, firstLineIndent=-7)


def para(text, name='body', markup=False):
    return Paragraph(text if markup else escape(text), styles[name])


def link(label, url):
    return f'<link href="{escape(url, quote=True)}" color="#202020"><u>{escape(label)}</u></link>'


def grid(rows, widths, headers=False, label_column=False, heights=None, extra=()):
    table = Table(rows, colWidths=widths, rowHeights=heights, hAlign='LEFT')
    commands = [('GRID', (0, 0), (-1, -1), .45, RULE), ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('LEFTPADDING', (0, 0), (-1, -1), 8), ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                ('TOPPADDING', (0, 0), (-1, -1), 6), ('BOTTOMPADDING', (0, 0), (-1, -1), 6)]
    if headers:
        commands.append(('BACKGROUND', (0, 0), (-1, 0), FILL))
    if label_column:
        commands.append(('BACKGROUND', (0, 0), (0, -1), FILL))
    table.setStyle(TableStyle(commands + list(extra)))
    return table


def bullets(texts, name='bullet'):
    items = []
    for i, text in enumerate(texts):
        if i:
            items.append(Spacer(1, 4))
        items.append(para('- ' + text, name))
    return items


def section(text):
    return [Spacer(1, 13), para(text, 'section'), Spacer(1, 5)]


def personal_values(linker):
    return [('성명', escape(DATA['name'])), ('생년월일', escape(DATA['birthDate'])),
            ('지원 분야', escape(DATA['title'])),
            ('연락처', escape(DATA['phone'])), ('이메일', linker(DATA['email'], 'mailto:' + DATA['email'])),
            ('GitHub', linker(DATA['github'].removeprefix('https://'), DATA['github'])),
            ('포트폴리오', linker(DATA['portfolio'].removeprefix('https://').rstrip('/'), DATA['portfolio']))]


def personal_table():
    path = HERE / 'img' / 'photo.jpg'
    iw, ih = ImageReader(str(path)).getSize()
    scale = min(76 / iw, 102 / ih)
    photo = Image(str(path), width=iw * scale, height=ih * scale)
    rows = [[photo if i == 0 else '', para(label, 'label'), para(value, 'cell', True)]
            for i, (label, value) in enumerate(personal_values(link))]
    return grid(rows, [94, 70, WIDTH - 164], heights=[20] * len(rows), extra=[
        ('SPAN', (0, 0), (0, -1)), ('ALIGN', (0, 0), (0, -1), 'CENTER'),
        ('BACKGROUND', (1, 0), (1, -1), FILL),
        ('TOPPADDING', (0, 0), (-1, -1), 2), ('BOTTOMPADDING', (0, 0), (-1, -1), 2)])


def experience_table():
    rows = [[para(t, 'label') for t in ['기간', '회사 / 담당 업무', '주요 내용']]]
    for job in DATA['jobs']:
        period = escape(job['period']).replace(' (', '<br/>(').replace(' 종료 예정)', '<br/>종료 예정)')
        company = [para(job['company'], 'cell'), Spacer(1, 4), para(job['role'], 'cell')]
        detail = [para(job['context'], 'cell'), Spacer(1, 4)] if 'context' in job else []
        detail += bullets(job.get('summaryBullets', job.get('bullets', [])), 'cellBullet')
        rows.append([para(period, 'period', True), company, detail])
    return grid(rows, [98, 113, WIDTH - 211], headers=True)


def education_table(schools, training=False):
    labels = ['기간', '교육 기관' if training else '학교', '교육 내용' if training else '전공 / 졸업']
    rows = [[para(t, 'label') for t in labels]]
    rows += [[para(s['period'], 'period'), para(s['name'], 'cell'), para(s['detail'], 'cell')] for s in schools]
    return grid(rows, [98, 132, WIDTH - 230], headers=True)


def project_links(project):
    return [(project['urlLabel'], project['url'])] if 'url' in project else project['links']


def project_block(project):
    rows = [[para(project['name'], 'project'), ''], [para('개요', 'label'), para(project['context'])]]
    if 'role' in project:
        rows.append([para('담당 범위', 'label'), para(project['role'])])
    if 'development' in project:
        rows.append([para('개발 방식', 'label'), para(project['development'])])
    rows += [[para('사용 기술', 'label'), para(project['stack'], 'meta')],
             [para('관련 링크', 'label'), para(' &nbsp;|&nbsp; '.join(link(*p) for p in project_links(project)), 'meta', True)]]
    contribution_header = len(rows)
    rows.append([para('작업 영역', 'label'), para('주요 기여', 'label')])
    rows += [[para(item['area'], 'cell'), para(item['description'])] for item in project['contributions']]
    return grid(rows, [70, WIDTH - 70], label_column=True, extra=[
        ('SPAN', (0, 0), (-1, 0)), ('BACKGROUND', (0, 0), (-1, 0), FILL),
        ('BACKGROUND', (0, contribution_header), (-1, contribution_header), FILL),
        ('VALIGN', (1, 1), (1, -1), 'TOP'),
        ('TOPPADDING', (0, 1), (-1, -1), 5), ('BOTTOMPADDING', (0, 1), (-1, -1), 5),
        ('TOPPADDING', (0, 0), (-1, 0), 8), ('BOTTOMPADDING', (0, 0), (-1, 0), 8)])


PROJECTS = DATA['jobs'][0]['projects'] + DATA['projects']
PAGE_COUNT = 1 + len(PROJECTS)


def troubleshooting_label():
    text = '트러블슈팅'
    width = pdfmetrics.stringWidth(text, 'PretendardBold', 9.5) + 22
    return Table([[para(text, 'caseLabel')]], colWidths=[width], rowHeights=[23],
                 hAlign='LEFT', cornerRadii=[11.5] * 4, style=TableStyle([
                     ('BOX', (0, 0), (-1, -1), .7, RULE),
                     ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                     ('LEFTPADDING', (0, 0), (-1, -1), 11),
                     ('RIGHTPADDING', (0, 0), (-1, -1), 10),
                     ('TOPPADDING', (0, 0), (-1, -1), 4.5),
                     ('BOTTOMPADDING', (0, 0), (-1, -1), 4.5),
                 ]))


def troubleshooting_comparison(case):
    gap = 24
    column_width = (WIDTH - gap) / 2
    table = Table([
        [para('문제 상황', 'caseLabel'), '', para('해결 및 결과', 'caseLabel')],
        [para(case['paragraphs'][0], 'caseBody'), '', para(case['paragraphs'][1], 'caseBody')],
    ], colWidths=[column_width, gap, column_width], hAlign='LEFT')
    table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('LINEABOVE', (0, 0), (0, 0), .8, INK),
        ('LINEABOVE', (2, 0), (2, 0), .8, INK),
        ('LINEBELOW', (0, 0), (0, 0), .5, RULE),
        ('LINEBELOW', (2, 0), (2, 0), .5, RULE),
        ('LINEBELOW', (0, 1), (-1, 1), .5, RULE),
        ('LEFTPADDING', (0, 0), (-1, -1), 0),
        ('RIGHTPADDING', (0, 0), (-1, -1), 0),
        ('TOPPADDING', (0, 0), (-1, 0), 8), ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('TOPPADDING', (0, 1), (-1, 1), 12), ('BOTTOMPADDING', (0, 1), (-1, 1), 12),
    ]))
    return KeepTogether([
        para(case['title'].replace('\n', ' '), 'caseTitle'), Spacer(1, 6), table,
    ])


def page_footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(.5)
    canvas.line(MARGIN, 34, W - MARGIN, 34)
    canvas.setFont('Pretendard', 8)
    canvas.setFillColor(SUB)
    canvas.drawString(MARGIN, 21, f"{DATA['name']} | {DATA['title']}")
    canvas.drawRightString(W - MARGIN, 21, f'{doc.page} / {PAGE_COUNT}')
    canvas.restoreState()


story = [para('이 력 서', 'title'), Spacer(1, 15), personal_table()]
story += section('소개') + [para(DATA['summary'])]
story += section('경험') + [experience_table()]
story += section('학력') + [education_table(DATA['education'][:1])]
story += section('교육 및 활동') + [education_table(DATA['education'][1:], training=True)]
project_pages = [(project, f"상상력집단 인턴 | {DATA['jobs'][0]['period']}") for project in DATA['jobs'][0]['projects']]
project_pages += [(project, '팀 프로젝트' + (f" | {project['period']}" if 'period' in project else '')) for project in DATA['projects']]
for project, subtitle in project_pages:
    story += [PageBreak(), para('프로젝트', 'pageTitle'), para(subtitle, 'meta'), Spacer(1, 15)]
    story += [KeepTogether([project_block(project)]), Spacer(1, 26), troubleshooting_label(), Spacer(1, 9)]
    for i, case in enumerate(project['troubleshooting']):
        if i:
            story.append(Spacer(1, 26))
        story.append(troubleshooting_comparison(case))
doc = BaseDocTemplate(str(OUT), pagesize=A4, title='천주아 | 프론트엔드 개발자 이력서',
                      author=DATA['name'], subject='인적 사항, 경험, 학력 및 프로젝트', pageCompression=1)
doc.addPageTemplates([PageTemplate(id='Resume', frames=[Frame(MARGIN, 49, WIDTH, H - 87,
    leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)], onPage=page_footer)])
doc.build(story)

# Keep the editable HTML synchronized with the PDF tables and content.
def hlink(label, url):
    return f'<a href="{escape(url, quote=True)}">{escape(label)}</a>'


def hlist(items):
    return '<ul>' + ''.join('<li>' + escape(item) + '</li>' for item in items) + '</ul>'


def htable(headers, rows, widths):
    cols = ''.join(f'<col style="width:{width / WIDTH * 100:.4f}%">' for width in widths)
    head = '<thead><tr>' + ''.join(f'<th scope="col">{escape(label)}</th>' for label in headers) + '</tr></thead>'
    body = '<tbody>' + ''.join('<tr>' + ''.join(f'<td>{cell}</td>' for cell in row) + '</tr>' for row in rows) + '</tbody>'
    return f'<table><colgroup>{cols}</colgroup>{head}{body}</table>'


def project_html(project):
    rows = [('개요', escape(project['context']))]
    if 'role' in project:
        rows.append(('담당 범위', escape(project['role'])))
    if 'development' in project:
        rows.append(('개발 방식', escape(project['development'])))
    rows += [('사용 기술', '<span class="meta">' + escape(project['stack']) + '</span>'),
             ('관련 링크', '<span class="meta">' + ' | '.join(hlink(*p) for p in project_links(project)) + '</span>')]
    content = ''.join(f'<tr><th scope="row">{escape(label)}</th><td>{value}</td></tr>' for label, value in rows)
    content += '<tr class="contribution-heading"><th scope="col">작업 영역</th><th scope="col">주요 기여</th></tr>'
    content += ''.join(f'<tr class="contribution-row"><th scope="row" class="contribution-area">{escape(item["area"])}</th><td>{escape(item["description"])}</td></tr>' for item in project['contributions'])
    return f'<article><table class="project-table"><colgroup><col style="width:{70 / WIDTH * 100:.4f}%"><col></colgroup><tbody><tr><th colspan="2" class="project-name"><h2>{escape(project["name"])}</h2></th></tr>{content}</tbody></table></article>'


def troubleshooting_html(project):
    cases = []
    for case in project['troubleshooting']:
        columns = ''.join('<div class="comparison-column"><h4>' + label + '</h4><p>' + escape(paragraph) + '</p></div>'
                          for label, paragraph in zip(['문제 상황', '해결 및 결과'], case['paragraphs']))
        cases.append('<div class="case-item"><h3>' + escape(case['title'].replace('\n', ' ')) + '</h3><div class="case-comparison">' + columns + '</div></div>')
    return '<section class="case-section"><h2>트러블슈팅</h2>' + ''.join(cases) + '</section>'


css = '''
@font-face{font-family:Pretendard;src:url("fonts/Pretendard-Regular.ttf") format("truetype");font-style:normal;font-weight:400;font-display:swap}
@font-face{font-family:Pretendard;src:url("fonts/Pretendard-Bold.ttf") format("truetype");font-style:normal;font-weight:700;font-display:swap}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:Pretendard,sans-serif;background:#e5e5e5;color:#202020;padding:28px 0;font-size:9.7pt;line-height:15pt;word-break:keep-all;overflow-wrap:break-word}
.page{width:210mm;min-height:297mm;margin:0 auto 28px;padding:13.4mm 14.1mm 19mm;background:#fff;position:relative;box-shadow:0 3px 18px #0001;break-after:page}
.resume-title{text-align:center;font-size:23pt;line-height:30pt;margin-bottom:15pt}
table{width:100%;border-collapse:collapse;table-layout:fixed;font-size:9.1pt;line-height:13.5pt}
th,td{border:.45pt solid #aeb0b3;padding:6pt 8pt;vertical-align:middle}
th{background:#f1f1f1;font-weight:700;text-align:center}a{color:inherit;text-underline-offset:2px}
.identity tr{height:20pt}.identity th,.identity td{padding:2pt 8pt}.identity .photo-cell{padding:8pt;text-align:center}
.photo{display:block;width:76pt;height:102pt;object-fit:contain;margin:auto}
.section{margin-top:13pt}.section h2{font-size:11.5pt;line-height:17pt;margin-bottom:5pt}
.period{text-align:center;font-size:8.7pt;line-height:13.5pt}.company p+p{margin-top:4pt}.experience-context{margin-bottom:4pt}
ul{list-style:none}li{padding-left:8pt;position:relative}li+li{margin-top:4pt}li::before{content:"-";position:absolute;left:0}
.page-title{font-size:16pt;line-height:23pt}.meta{font-size:9pt;line-height:14pt;color:#555}
.projects header{margin-bottom:15pt}article+article{margin-top:12pt}
.project-table th,.project-table td{padding-top:5pt;padding-bottom:5pt}
.project-table td{font-size:9.7pt;line-height:15pt;vertical-align:top}
.project-table .contribution-area{text-align:left;font-weight:400}
.case-section{margin-top:26pt;break-inside:avoid}.case-section>h2{display:table;font-size:9.5pt;line-height:14pt;padding:3.8pt 10pt;border:.7pt solid #aeb0b3;border-radius:999px;margin-bottom:9pt}
.case-item{padding-bottom:12pt;border-bottom:.5pt solid #aeb0b3;break-inside:avoid}
.case-item+.case-item{margin-top:26pt}.case-item>h3{font-size:13.5pt;line-height:20pt;margin-bottom:6pt}
.case-comparison{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:24pt}
.comparison-column h4{font-size:9.5pt;line-height:14pt;font-weight:700;border-top:.8pt solid #202020;border-bottom:.5pt solid #aeb0b3;padding:8pt 0}
.comparison-column p{font-size:10.2pt;line-height:17pt;padding-top:12pt}
.project-name{text-align:left;padding:8pt}.project-name h2{font-size:12pt;line-height:18pt}
.footer{position:absolute;bottom:7mm;left:14.1mm;right:14.1mm;display:flex;justify-content:space-between;border-top:.5pt solid #aeb0b3;padding-top:4pt;color:#555;font-size:8pt;line-height:10pt}
@media print{body{padding:0;background:white}.page{height:297mm;min-height:0;margin:0;box-shadow:none}.page:last-child{break-after:auto}@page{size:A4;margin:0}}
'''
head = '<!doctype html><html lang="ko"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>천주아 | 프론트엔드 개발자 이력서</title><style>' + css + '</style></head><body>'
identity = '<table class="identity"><colgroup>' + ''.join(f'<col style="width:{w / WIDTH * 100:.4f}%">' for w in [94, 70, WIDTH - 164]) + '</colgroup><tbody>'
identity_values = personal_values(hlink)
for i, (label, value) in enumerate(identity_values):
    photo = f'<td rowspan="{len(identity_values)}" class="photo-cell"><img class="photo" src="img/photo.jpg" alt="천주아 증명사진"></td>' if i == 0 else ''
    identity += f'<tr>{photo}<th scope="row">{escape(label)}</th><td>{value}</td></tr>'
identity += '</tbody></table>'
main = '<h1 class="resume-title">이 력 서</h1>' + identity
main += '<section class="section"><h2>소개</h2><p>' + escape(DATA['summary']) + '</p></section>'
rows = []
for job in DATA['jobs']:
    period = '<p class="period">' + escape(job['period']).replace(' (', '<br>(').replace(' 종료 예정)', '<br>종료 예정)') + '</p>'
    company = '<div class="company"><p>' + escape(job['company']) + '</p><p>' + escape(job['role']) + '</p></div>'
    detail = '<p class="experience-context">' + escape(job['context']) + '</p>' if 'context' in job else ''
    detail += hlist(job.get('summaryBullets', job.get('bullets', [])))
    rows.append([period, company, detail])
main += '<section class="section"><h2>경험</h2>' + htable(['기간', '회사 / 담당 업무', '주요 내용'], rows, [98, 113, WIDTH - 211]) + '</section>'
for label, schools, headers in [
    ('학력', DATA['education'][:1], ['기간', '학교', '전공 / 졸업']),
    ('교육 및 활동', DATA['education'][1:], ['기간', '교육 기관', '교육 내용']),
]:
    rows = [['<p class="period">' + escape(s['period']) + '</p>', escape(s['name']), escape(s['detail'])] for s in schools]
    main += f'<section class="section"><h2>{label}</h2>' + htable(headers, rows, [98, 132, WIDTH - 230]) + '</section>'


def hfooter(n):
    return f'<footer class="footer"><span>{escape(DATA["name"])} | {escape(DATA["title"])}</span><span>{n} / {PAGE_COUNT}</span></footer>'


html = head + '<div class="page resume"><main>' + main + '</main>' + hfooter(1) + '</div>'
for n, (project, label) in enumerate(project_pages, 2):
    html += '<div class="page projects"><main><header><h1 class="page-title">프로젝트</h1><p class="meta">' + escape(label) + '</p></header>'
    html += project_html(project) + troubleshooting_html(project)
    html += '</main>' + hfooter(n) + '</div>'
html += '</body></html>'
(HERE / 'draft.html').write_text(html, encoding='utf-8')
print(OUT)
print(HERE / 'draft.html')
