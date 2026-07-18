#!/usr/bin/env python3
import csv
import re
import argparse
from datetime import datetime

# 1. Tester Name & Actor Name Unification Dictionary
NAME_MAP = {
    'ADITI': 'Aditi Dhadwal', 'ADITI.DHADWAL': 'Aditi Dhadwal', 'ADITI DHADWAL': 'Aditi Dhadwal',
    'aditya.kumar': 'Aditya Kumar', 'aditya kumar': 'Aditya Kumar',
    'ANIL': 'Anil Kumar S', 'ANIL.KUMAR.S': 'Anil Kumar S', 'ANIL KUMAR S': 'Anil Kumar S',
    'ANJALI': 'Anjali Chauhan', 'anjali': 'Anjali Chauhan', 'anjali chauhan': 'Anjali Chauhan',
    'ANMOL KAUNDOL': 'Anmol Kaundal', 'anmol kaundal': 'Anmol Kaundal',
    'B.SASIDHAR': 'B. Sasidhar', 'B.sasidhar': 'B. Sasidhar', 'SASHIDHAR': 'B. Sasidhar', 'SASIDHAR': 'B. Sasidhar',
    'BISEN NUPUR CHNADRAKUMAR': 'Bisen Nupur Chandrakumar', 'Bisen Nupur': 'Bisen Nupur Chandrakumar', 'NUPUR': 'Bisen Nupur Chandrakumar', 'Nupur bisen': 'Bisen Nupur Chandrakumar', 'nupur.chandra.kumar': 'Bisen Nupur Chandrakumar',
    'CH.SHARMILA': 'CH. Sharmila', 'CH. sharmila': 'CH. Sharmila', 'CH. sharmila  ': 'CH. Sharmila',
    'DEEPAK.SR': 'Deepak', 'deppak': 'Deepak',
    'DEEPIKA . R': 'Deepika R', 'DEEPIKA.R': 'Deepika R',
    'DEEPIKA': 'Deepika Rathore', 'deepika': 'Deepika Rathore',
    'DEV': 'Dev Jagdishbhai Bhutiya', 'dev.bhutiya': 'Dev Jagdishbhai Bhutiya',
    'DHERAJ SHARMA': 'Dheeraj Sharma', 'dheeraj': 'Dheeraj Sharma',
    'DIVYADARSHNI': 'Divyadarshini', 'DIVYADASRSHNI': 'Divyadarshini', 'Divyadarshni': 'Divyadarshini', 'divya darshini': 'Divyadarshini',
    'emayamathig': 'Emayamathi G',
    'Girishma': 'Girishma Gonnabathula', 'Grishma': 'Girishma Gonnabathula',
    'G.VEENA': 'Gontyala Veena', 'GONTYALA': 'Gontyala Veena', 'Veena': 'Gontyala Veena',
    'JAHANVI': 'Jahnavi Gaddam', 'JAHNAVI': 'Jahnavi Gaddam', 'JAHNAVI.G': 'Jahnavi Gaddam', 'JAHNAVI.GADDAM': 'Jahnavi Gaddam', 'JANHNVI': 'Jahnavi Gaddam', 'JANHVI': 'Jahnavi Gaddam', 'JHANHVI': 'Jahnavi Gaddam', 'Jahnavi': 'Jahnavi Gaddam',
    'JAYASHREE': 'Jayashree N', 'Jayasree': 'Jayashree N', 'Jayshree': 'Jayashree N', 'jayashree.N': 'Jayashree N',
    'JHOYDEEP': 'Joydeep', 'JOYDEEP': 'Joydeep', 'JOYDEEP ': 'Joydeep',
    'K.Deni sudha': 'K. Deni Sudha', 'K. Deni sudha': 'K. Deni Sudha',
    'Kavya': 'Kavya Ponugoti', 'Kavya Ponnugoti': 'Kavya Ponugoti',
    'KHAJA': 'Khaja Suhaib', 'Khaja Suhai': 'Khaja Suhaib', 'Khaja Suhaib .': 'Khaja Suhaib',
    'LAKSHMI': 'Lakshmi Aravind', 'Lakshmi Arvind': 'Lakshmi Aravind',
    'LAKSHMI RANGANATH': 'Lakshmi Ranganath C J', 'LAKSHMI.RANGANATH': 'Lakshmi Ranganath C J', 'RANGANATH C J': 'Lakshmi Ranganath C J',
    'LAVAIL': 'Lavail Joy', 'LAVAIL  JOY': 'Lavail Joy', 'Lavail': 'Lavail Joy',
    'Likhitha Gantla': 'Likitha Gantla', 'Likitha': 'Likitha Gantla',
    'MALLIKARJIN': 'Mallikarjun', 'MALLIKARJUNA': 'Mallikarjun',
    'MARESALVI': 'Mariselvi', 'MARESELVI': 'Mariselvi', 'MARESLVI': 'Mariselvi', 'MARIDELVI': 'Mariselvi', 'Marislevi': 'Mariselvi',
    'MINI': 'Mini Mahajan', 'Min': 'Mini Mahajan',
    'MOHAMMAND': 'Mohammad Saleem Paasha', 'MOHAMMED SALEEM PAASHA': 'Mohammad Saleem Paasha', 'Mohammad Saleem pasha': 'Mohammad Saleem Paasha', 'md.saleem': 'Mohammad Saleem Paasha', 'saleem': 'Mohammad Saleem Paasha',
    'MONICA M•': 'Monica M', 'MONICA.M': 'Monica M', 'MONICA': 'Monica M',
    'NEELIMA': 'Neelima M B', 'NEELIMA.MB': 'Neelima M B', 'Neelima MB': 'Neelima M B', 'Nieema': 'Neelima M B', 'Nileema': 'Neelima M B',
    'PALLAVI': 'Pallavi J P', 'PALLAVI JP': 'Pallavi J P', 'Pallavi .JP': 'Pallavi J P', 'Pallavi JP': 'Pallavi J P', 'pallavi.jp': 'Pallavi J P',
    'pooja': 'Pooja Soni',
    'PRERNA': 'Prerna Bharti', 'Perana': 'Prerna Bharti', 'Perna': 'Prerna Bharti',
    'RAJWANT': 'Rajwant Kaur', 'Rajwanth kaur': 'Rajwant Kaur', 'Rajwat': 'Rajwant Kaur',
    'RAVINDRA': 'Ravindra Prasad', 'RAVINDRA.PRASAD': 'Ravindra Prasad', 'RAVIRNDRA': 'Ravindra Prasad', 'Ravinder': 'Ravindra Prasad',
    'RIMPA': 'Rimpa Bera', 'rimpa': 'Rimpa Bera',
    'Rishi Kumar.G': 'Rishi Kumar G',
    'Ritik': 'Ritik Thakur',
    'Rohan': 'Rohan Chand',
    'Rojan': 'Rojan Darjee', 'rojan.darjee': 'Rojan Darjee',
    'ROUNAQ ANSAR': 'Rounaq Ansari',
    'Salim': 'Salim Sahaji', 'Salim Sahaj': 'Salim Sahaji', 'Salim Sahaji•': 'Salim Sahaji', 'Salim sahji': 'Salim Sahaji',
    'SANJAY': 'Sanjay Choudhary', 'Sanjay  Choudhary': 'Sanjay Choudhary', 'Sanjay Choudhar': 'Sanjay Choudhary', 'sanjay choudary': 'Sanjay Choudhary',
    'SAPANPREET': 'Sapanpreet Kaur',
    'SATARUPA': 'Satarupa Saha', 'SATARUPA SAPA': 'Satarupa Saha', 'Satruo saha': 'Satarupa Saha', 'Satrupa saha': 'Satarupa Saha', 'satarupa sah': 'Satarupa Saha',
    'SHARMILA': 'Sharmila S', 'SHARMILA.S': 'Sharmila S', 'Sharmila.S': 'Sharmila S', 'Sharnila': 'Sharmila S',
    'SHIVENDRA': 'Shivendra Pratap Singh', 'SHIVENDRA PRATAP': 'Shivendra Pratap Singh', 'Shivender': 'Shivendra Pratap Singh', 'Shivendra Pratap Sing': 'Shivendra Pratap Singh', 'Shivendra Pratap Singh•': 'Shivendra Pratap Singh',
    'SIPPORA': 'Sippora Nandam',
    'SOUMYA': 'Soumya R', 'Sowmiya': 'Soumya R', 'Sowmya': 'Soumya R', 'Sowmya .R': 'Soumya R', 'Sowmya R': 'Soumya R', 'Sowmya.R': 'Soumya R', 'sowmya.r': 'Soumya R',
    'srimanta': 'Srimanta Bagdi',
    'SUGYANI': 'Sugyani Kar', 'SUGYANI.KAR': 'Sugyani Kar',
    'SURAIYA': 'Suraiya Amin',
    'SURESH': 'Suresh Bhardwaj', 'SURESH BHARADWAJ': 'Suresh Bhardwaj', 'SURSH': 'Suresh Bhardwaj', 'Suresh.bhardwaj': 'Suresh Bhardwaj',
    'Teja': 'Tejas Dange', 'Tejas': 'Tejas Dange', 'Tejas Dan': 'Tejas Dange', 'Tejas Dang': 'Tejas Dange', 'ejas Dange': 'Tejas Dange',
    'THARA LAKSHMI': 'Tharalakshmi A K', 'THARALAKSHMI': 'Tharalakshmi A K', 'Tharalakshmi': 'Tharalakshmi A K', 'Tharalakshmi AK': 'Tharalakshmi A K', 'Tharalaksmi': 'Tharalakshmi A K', 'Tharalaxmi': 'Tharalakshmi A K',
    'UTKARSH SINGH': 'Utkarsh Singh Vishen', 'Utarkarsh': 'Utkarsh Singh Vishen', 'Utkarsh': 'Utkarsh Singh Vishen', 'Utkarsh Singh': 'Utkarsh Singh Vishen', 'Utkarsh Singh Vishe': 'Utkarsh Singh Vishen',
    'VARSHA': 'Varsha Shekhar', 'VARSHA SHEKAR': 'Varsha Shekhar', 'VARSHSA': 'Varsha Shekhar', 'VASRSHA': 'Varsha Shekhar',
    'YASH': 'Yash Praveen Khot', 'YASH PARVEEN': 'Yash Praveen Khot', 'YASH PARVIN': 'Yash Praveen Khot', 'YASH PRAVEEN': 'Yash Praveen Khot', 'Yash Praveen': 'Yash Praveen Khot', 'Yash praveen.khot': 'Yash Praveen Khot'
}

def clean_name(name):
    if not name:
        return ''
    cleaned = name.strip().replace('\n', ' ').replace('\r', ' ')
    cleaned = re.sub(r'\s+', ' ', cleaned)
    if cleaned.upper() in ['NA', 'NIL']:
        return cleaned.upper()
    
    # Check map
    key = cleaned.upper()
    if key in [k.upper() for k in NAME_MAP.keys()]:
        # Return standardized name
        for k, v in NAME_MAP.items():
            if k.upper() == key:
                return v
    # Default to title-case if not found
    return cleaned.title()

def clean_date(date_str):
    if not date_str or date_str.strip().upper() in ['NA', 'NIL', '']:
        return ''
    cleaned = date_str.strip().replace(' ', '')
    # Check for formats
    for fmt in ('%d-%B-%Y', '%d-%b-%Y', '%d-%m-%Y', '%d-%m-%y', '%d.%m.%Y', '%d/%m/%Y', '%Y-%m-%d'):
        try:
            dt = datetime.strptime(cleaned, fmt)
            return dt.strftime('%Y-%m-%d')
        except ValueError:
            pass
    return date_str

def parse_time_to_minutes(time_str):
    if not time_str or time_str.strip().upper() in ['NA', 'NIL', '', '#VALUE!']:
        return None
    val = time_str.strip().upper().replace(' ', '').replace(',', '')
    
    # 1. Decimal Floats e.g. 11.5 or 6.52
    if re.match(r'^\d+\.\d+$', val):
        f = float(val)
        if f > 24.0:
            # Maybe duration in minutes or other format
            return f
        hours = int(f)
        mins = int(round((f - hours) * 100))
        # Clamp minutes to 59
        if mins >= 60:
            mins = 59
        return hours * 60 + mins

    # 2. Integer hours
    if re.match(r'^\d+$', val):
        return int(val) * 60

    # 3. AM/PM formats
    match = re.match(r'^(\d+)(?::(\d+))?(?::(\d+))?(AM|PM)$', val)
    if match:
        h = int(match.group(1))
        m = int(match.group(2)) if match.group(2) else 0
        ampm = match.group(4)
        if ampm == 'PM' and h < 12:
            h += 12
        elif ampm == 'AM' and h == 12:
            h = 0
        return h * 60 + m

    # 4. Standard HH:MM:SS
    match = re.match(r'^(\d+):(\d+)(?::(\d+))?$', val)
    if match:
        h = int(match.group(1))
        m = int(match.group(2))
        return h * 60 + m
        
    return None

def clean_binary(val):
    if not val:
        return ''
    cleaned = val.strip().upper()
    if cleaned in ['YES', 'Y', 'YE', 'CORRECT', 'DISPLAYED']:
        return 'Yes'
    if cleaned in ['NO', 'N', 'NOT YET', 'NOT DISPLAYED']:
        return 'No'
    if cleaned in ['NA', 'NIL']:
        return cleaned
    return val.strip()

def process_file(input_path, output_path):
    print(f'Loading raw data from {input_path}...')
    with open(input_path, 'r', encoding='utf-8', errors='ignore') as f:
        reader = list(csv.reader(f))
        
    # Find Header row starting with Test ID
    header_idx = -1
    for idx, row in enumerate(reader):
        if row and row[0].strip().upper() == 'TEST ID':
            header_idx = idx
            break
            
    if header_idx == -1:
        raise ValueError('Could not find header row starting with \"Test ID\"!')
        
    headers = [h.strip() for h in reader[header_idx]]
    data_rows = reader[header_idx + 1:]
    
    print(f'Detected headers (total {len(headers)} columns). Found {len(data_rows)} data rows.')
    
    clean_rows = []
    
    for row_num, row in enumerate(data_rows, start=header_idx + 2):
        if not row or not row[0].strip():
            continue
            
        test_id = row[0].strip()
        new_row = list(row)
        
        # padding/trimming columns to match header count
        if len(new_row) < len(headers):
            new_row.extend([''] * (len(headers) - len(new_row)))
        else:
            new_row = new_row[:len(headers)]
            
        # --- 1. Apply Shift Repairs ---
        # TL-2477 Reviewer1 transpositions
        if test_id == 'TL-2477':
            name_idx = headers.index('Reviewer1 Name')
            asg_idx = headers.index('Reviewer1 Assignment Time')
            cmp_idx = headers.index('Reviewer1 Completion Time')
            tat_idx = headers.index('Review1 TAT (mins) [Auto]')
            new_row[name_idx] = 'Ambika'
            new_row[asg_idx] = '2026-06-25 11:39:47'
            new_row[cmp_idx] = '2026-06-25 11:39:47'
            new_row[tat_idx] = '0.0'
            
        # TL-5222 Shifted cells repair
        elif test_id == 'TL-5222':
            r4_name_idx = headers.index('Reviewer4 Name')
            r4_asg_idx = headers.index('Reviewer4 Assignment Time')
            r4_cmp_idx = headers.index('Reviewer4 Completion Time')
            r4_tat_idx = headers.index('Review4 TAT (mins) [Auto]')
            new_row[r4_name_idx] = 'Suraiya Amin'
            new_row[r4_asg_idx] = '2026-07-10 20:00:04'
            new_row[r4_cmp_idx] = '2026-07-10 20:07:13'
            new_row[r4_tat_idx] = '7.13'

        # --- 2. Normalization & Standardization ---
        # Names Standardization
        name_cols = ['Tester Name', "Author's Name", 'Reviewer1 Name', 'Reviewer2 Name', 'Reviewer3 Name', 'Reviewer4 Name', 'Reviewer5 Name', "Moderator's Name"]
        for col in name_cols:
            idx = headers.index(col)
            new_row[idx] = clean_name(new_row[idx])
            
        # Dates Standardization
        date_idx = headers.index('Test Date')
        new_row[date_idx] = clean_date(new_row[date_idx])
        
        # Categorical labels cleanup
        status_idx = headers.index('Overall Test Status')
        if new_row[status_idx].strip().upper() in ['PASS', 'CORRECT']:
            new_row[status_idx] = 'Pass'
        elif new_row[status_idx].strip().upper() in ['FAIL', 'INCORRECT']:
            new_row[status_idx] = 'Fail'
            
        severity_idx = headers.index('Defect Severity')
        if new_row[severity_idx].strip().upper() in ['NO DEFECT', 'NO DFECT', 'NIL', 'NA']:
            new_row[severity_idx] = 'No Defect'
        elif new_row[severity_idx].strip().upper() == 'CRITICAL':
            new_row[severity_idx] = 'Critical'
            
        # Standardize binary columns
        binary_cols = [
            'Question in Review Model?', 'Follow-up Q in Review Model?', 'Answer Scientifically Correct?',
            'Expert Name Displayed?', 'Correct Expert Name?', 'Source Links Provided?', 
            '120-min Msg Shown to User?', 'Notification Received?', 'Notification on Same Thread?', 
            'Notification Linked Correct Q-ID?', 'Voice Input Working?', 'Voice Output Working?', 
            'Weather Q Answered Correctly?', 'Mandi Price Q Correct?', 'Scheme Q Correct?', 
            'Question Saved in DB?', 'Answer Saved in DB?', 'Q-ID Consistent Across Systems?', 
            'WhatsApp vs Web Answer Match?'
        ]
        for col in binary_cols:
            idx = headers.index(col)
            new_row[idx] = clean_binary(new_row[idx])

        # --- 3. Enforce Strict Cleaning Filters ---
        # A row is kept only if all 18 core parameters are populated (not empty/NA/NIL)
        core_cols = [
            'Test Date', 'Tester Name', 'Build / Version', 'Channel Tested', 'Language Tested', 
            'Question ID', 'Question Category', 'Type of Question', 'Overall Test Status', 'SLA Status', 
            'Defect Severity', 'Answer Scientifically Correct?', 'Question Saved in DB?', 
            'Answer Saved in DB?', 'Q-ID Consistent Across Systems?', 'Source Links Provided?', 
            'Translation Quality', 'Respo nse Time (mins) [Auto]'
        ]
        
        is_row_valid = True
        for col in core_cols:
            idx = headers.index(col)
            val = new_row[idx].strip().upper()
            if not val or val in ['NA', 'NIL', 'NAN', 'N/A', '\\\\']:
                is_row_valid = False
                break
                
        if not is_row_valid:
            continue  # Reject this row (failed core parameter null check)
            
        # Category conditional rules
        cat = new_row[headers.index('Question Category')].upper()
        weather_idx = headers.index('Weather Q Answered Correctly?')
        mandi_idx = headers.index('Mandi Price Q Correct?')
        scheme_idx = headers.index('Scheme Q Correct?')
        
        if 'WEATHER' in cat and new_row[weather_idx].strip().upper() in ['NA', 'NIL', '']:
            continue
        if ('MANDI' in cat or 'MARKET' in cat) and new_row[mandi_idx].strip().upper() in ['NA', 'NIL', '']:
            continue
        if 'SCHEME' in cat and new_row[scheme_idx].strip().upper() in ['NA', 'NIL', '']:
            continue
            
        # Expert Name attribution check
        exp_disp_idx = headers.index('Expert Name Displayed?')
        exp_name_idx = headers.index('Correct Expert Name?')
        if new_row[exp_disp_idx] == 'Yes' and new_row[exp_name_idx].strip().upper() in ['NA', 'NIL', '']:
            continue

        clean_rows.append(new_row)
        
    print(f'Filtering completed. Retained {len(clean_rows)} clean records.')
    
    # Save to output file
    with open(output_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(headers)
        writer.writerows(clean_rows)
        
    print(f'Successfully exported clean dataset to {output_path}!')

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Agri Advisory QA Test Log Normalizer & Cleaner')
    parser.add_argument('--input', default='../data/raw/Agri_Advisory_QA_Test_Log (1.0) - Test Log_1 (1).csv', help='Path to raw input CSV file')
    parser.add_argument('--output', default='../data/processed/cleandataset.csv', help='Path to output clean CSV file')
    args = parser.parse_args()
    
    process_file(args.input, args.output)
