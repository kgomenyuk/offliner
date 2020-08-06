import jsons


class Face:
    min_age = 0
    max_age = 0
    gender = ''


class Response:
    def json(self):
        return jsons.dump(self)


class AgeGenderResponse(Response):
    status = ''
    detail = ''
    faces = []


class DetectResponse(Response):
    status = ''
    detail = ''
