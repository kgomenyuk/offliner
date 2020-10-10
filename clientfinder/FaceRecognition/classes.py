import jsons
import datetime as dt


class Face:
    min_age = 0
    max_age = 0
    gender = ''


class Response:
    status = ''
    detail = ''

    def json(self):
        return jsons.dump(self)


class AgeGenderResponse(Response):
    faces = []


class DetectResponse(Response):
    pass


class MarkResponse(Response):
    start = dt.datetime.now()
    end = dt.datetime.now()
    count = 0
