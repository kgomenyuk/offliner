import psycopg2
import os
import numpy as np
from datetime import datetime

class get_db:
    def __init__(self):
        self.name = os.environ.get('DB_NAME')
        self.user = os.environ.get('DB_USER')
        self.password = os.environ.get('DB_PWD')
        self.host = os.environ.get('DB_HOST')
        self.port = os.environ.get('DB_PORT')

    @staticmethod
    def change(s):
        try:
            s = s.tolist()
        except:
            s = np.array(s)
            s = s.tolist()
        s = str(s)
        m = s.replace('[', '{').replace(']', '}')
        return m

    def insert(self, data):
        self.conn = psycopg2.connect(database=self.name, user=self.user, password=self.password, host=self.host,
                                     port=self.port)
        self.cur = self.conn.cursor()
        for i in data:
            vector = self.change(i[0])
            minage = i[1][0]
            maxage = i[1][1]
            sex = i[1][2]
            date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            self.cur.execute(
                f"INSERT INTO FACEVECTORS (FACEVECTORS, agemin, agemax, sex, date) VALUES ('{vector}', '{minage}', '{maxage}', '{sex}', '{date}')")
        self.conn.commit()
        print('Inserted successfully')
        self.cur.close()
        self.conn.close()
        print('Cursor and connection closed')

    def get(self):
        self.conn = psycopg2.connect(database=self.name, user=self.user, password=self.password, host=self.host,
                                     port=self.port)
        self.cur = self.conn.cursor()
        self.cur.execute("SELECT FACEVECTORS FROM FACEVECTORS")
        rows = self.cur.fetchall()
        print("Got: ")
        self.cur.close()
        self.conn.close()
        print('Cursor and connection Closed')
        return rows
