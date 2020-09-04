import psycopg2
import os
import numpy as np


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
            k = self.change(i)
            self.cur.execute(f"INSERT INTO FACEVECTORS (FACEVECTORS) VALUES ('{k}')")
        self.conn.commit()
        print('Inserted')
        self.cur.close()
        self.conn.close()
        print('Cursor and connection Closed')

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
