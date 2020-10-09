import psycopg2
from datetime import datetime
from credits import *

conn = psycopg2.connect(database=name, user=user, password=password, host=host, port=port)
cur = conn.cursor()


def uniqueGuests(start_datetime, end_datetime):
    guests = []
    start_datetime = datetime.strptime(start_datetime, '%Y-%m-%d %H:%M:%S.%f')
    end_datetime = datetime.strptime(end_datetime, '%Y-%m-%d %H:%M:%S.%f')

    cur.execute('select distinct id, date from facevectors')
    for guest in cur:
        if guest[-1] and start_datetime <= guest[-1] <= end_datetime:
            guests.append(guest)

    return guests, len(guests)


print(uniqueGuests('2020-09-11 22:33:27.000000', '2020-09-11 22:48:26.000000'))
