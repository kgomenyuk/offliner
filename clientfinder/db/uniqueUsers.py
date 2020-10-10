import psycopg2
from datetime import datetime
import os
from FaceRecognition.classes import MarkResponse


def uniqueGuests(start_datetime, end_datetime):
    conn = psycopg2.connect(database=os.environ.get('DB_NAME'),
                            user=os.environ.get('DB_USER'),
                            password=os.environ.get('DB_PWD'),
                            host=os.environ.get('DB_HOST'),
                            port=os.environ.get('DB_PORT'))
    cur = conn.cursor()
    guests = []
    start_datetime = datetime.strptime(start_datetime, '%Y-%m-%d %H:%M:%S.%f')
    end_datetime = datetime.strptime(end_datetime, '%Y-%m-%d %H:%M:%S.%f')

    cur.execute('select distinct id, date from facevectors')
    for guest in cur:
        if guest[-1] and start_datetime <= guest[-1] <= end_datetime:
            guests.append(guest)

    cur.close()
    conn.close()

    response = MarkResponse()
    response.start = start_datetime
    response.end = end_datetime
    response.count = len(guests)
    return response


#print(uniqueGuests('2020-09-11 22:33:27.000000', '2020-09-11 22:48:26.000000'))
