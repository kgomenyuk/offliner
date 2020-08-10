import jsons


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
