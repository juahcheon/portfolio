#!/usr/bin/env python3
"""Lint application JSON and compare independently captured submitted copies.

Read-only; standard library only. This does not verify websites or career facts.
"""

import argparse
import json
import sys
from pathlib import Path


def normalize(text):
    """Normalize transport differences without hiding paragraph mistakes."""
    return text.replace("\r\n", "\n").replace("\r", "\n").replace("\u00a0", " ")


def nonempty(value):
    return isinstance(value, str) and bool(value.strip())


def read_records(path):
    records = json.loads(Path(path).read_text(encoding="utf-8-sig"))
    if not isinstance(records, list) or not records:
        raise ValueError("Expected a non-empty JSON array.")
    return records


def validate(records, label):
    errors = []
    ids, postings, applications = set(), set(), set()
    for index, record in enumerate(records, 1):
        where = f"{label}[{index}]"
        if not isinstance(record, dict):
            errors.append(f"{where}: record must be an object")
            continue
        for field in ("id", "company", "role"):
            if not nonempty(record.get(field)):
                errors.append(f"{where}.{field}: non-empty string required")
        record_id = record.get("id")
        if nonempty(record_id):
            if record_id in ids:
                errors.append(f"{where}.id: duplicate record ID")
            ids.add(record_id)

        platform = record.get("platform", "saramin")
        if not nonempty(platform):
            errors.append(f"{where}.platform: non-empty string required")
        for field, seen in (("recIdx", postings), ("applicationId", applications)):
            value = record.get(field)
            if value is None:
                continue
            if not nonempty(value):
                errors.append(f"{where}.{field}: use a non-empty string")
                continue
            if not nonempty(platform):
                continue
            # One posting may include different roles; receipt IDs remain unique.
            key = (platform, value, record.get("role")) if field == "recIdx" else (platform, value)
            if field == "recIdx" and not nonempty(record.get("role")):
                continue
            if key in seen:
                errors.append(f"{where}.{field}: duplicate application/posting identity")
            seen.add(key)

        if "verified" in record and not isinstance(record["verified"], bool):
            errors.append(f"{where}.verified: boolean required")
        if record.get("verified") is True:
            for field in ("submittedAt", "applicationId"):
                if not nonempty(record.get(field)):
                    errors.append(f"{where}.{field}: required for a verified record")
            if not any(nonempty(record.get(field)) for field in ("submittedResumeUrl", "receiptEvidence")):
                errors.append(f"{where}: verified record needs a submitted-copy URL or receipt evidence")
        if "attachments" in record and not isinstance(record["attachments"], list):
            errors.append(f"{where}.attachments: array required")

        introductions = record.get("introductions")
        if not isinstance(introductions, list) or not introductions:
            errors.append(f"{where}.introductions: non-empty array required")
            continue
        titles = set()
        for item_index, item in enumerate(introductions, 1):
            location = f"{where}.introductions[{item_index}]"
            if not isinstance(item, dict):
                errors.append(f"{location}: object required")
                continue
            for field in ("title", "text"):
                value = item.get(field)
                if not nonempty(value):
                    errors.append(f"{location}.{field}: non-empty string required")
                    continue
                value = normalize(value)
                if "\t" in value:
                    errors.append(f"{location}.{field}: tab character")
                if any(not line.strip() for line in value.split("\n")):
                    errors.append(f"{location}.{field}: empty paragraph/line")
                if field == "title":
                    if "\n" in value:
                        errors.append(f"{location}.title: must be a single line")
                    if value in titles:
                        errors.append(f"{location}.title: duplicate title")
                    titles.add(value)
    return errors


def compare(expected, submitted):
    """Inputs must have passed validate() before comparing."""
    errors = []
    actual_by_id = {record["id"]: record for record in submitted}
    expected_ids = {record["id"] for record in expected}
    if expected_ids != set(actual_by_id):
        missing = len(expected_ids - set(actual_by_id))
        extra = len(set(actual_by_id) - expected_ids)
        errors.append(f"comparison: {missing} missing and {extra} unexpected submitted records")
    for index, record in enumerate(expected, 1):
        actual = actual_by_id.get(record["id"])
        if actual is None:
            continue
        where = f"comparison[{index}]"
        for field in ("company", "role", "platform", "recIdx", "applicationId", "attachments"):
            if field == "platform":
                wanted, received = record.get(field, "saramin"), actual.get(field, "saramin")
            elif field in record:
                wanted, received = record[field], actual.get(field)
            else:
                continue
            if wanted != received:
                errors.append(f"{where}.{field}: mismatch")
        wanted_items, actual_items = record["introductions"], actual["introductions"]
        if len(wanted_items) != len(actual_items):
            errors.append(f"{where}.introductions: item count mismatch")
        for item_index, (wanted, received) in enumerate(zip(wanted_items, actual_items), 1):
            for field in ("title", "text"):
                if normalize(wanted[field]) != normalize(received[field]):
                    errors.append(f"{where}.introductions[{item_index}].{field}: mismatch")
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("expected", help="UTF-8 JSON array of intended application records")
    parser.add_argument("--submitted", help="JSON independently extracted from submitted copies")
    args = parser.parse_args()
    try:
        expected = read_records(args.expected)
        submitted = read_records(args.submitted) if args.submitted else None
    except (OSError, UnicodeError, ValueError):
        print("ERROR: Cannot read input as a non-empty UTF-8 JSON array.", file=sys.stderr)
        return 2

    errors = validate(expected, "expected")
    if submitted is not None:
        errors.extend(validate(submitted, "submitted"))
        if not errors:
            errors.extend(compare(expected, submitted))
    if errors:
        for error in errors:
            print(f"ERROR: {error}", file=sys.stderr)
        return 1
    item_count = sum(len(record["introductions"]) for record in expected)
    check = "format + submitted-copy comparison" if submitted is not None else "format only"
    print(f"PASS: {len(expected)} records, {item_count} introductions; {check}.")
    print("File checks only; independently confirm website receipt, attachments, and factual claims.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
