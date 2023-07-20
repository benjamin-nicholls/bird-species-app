from flask import Flask, request
from prediction.prediction import getPred

app = Flask(__name__)


def process_image(img = 'img.jpeg'):
    return getPred(img)


@app.route("/image", methods=['GET', 'POST'])
def image():
    if(request.method == "POST"):
        image_bytes = request.get_data()
        with open('img.jpeg', 'wb') as out:
            out.write(image_bytes)
        #return "Image read"
    result = process_image('img.jpeg')
    if result:
        return result
    else:
        return 'Error handling file'
    

if __name__ == '__main__':
    host = '127.0.0.1'     # iOS feedback
    #host = '10.0.2.2'      # Android feedback
    host = '192.168.0.18'  # local home router
    #host = '172.20.10.5'   # mobile tether
    app.run(host=host, port='5000')
