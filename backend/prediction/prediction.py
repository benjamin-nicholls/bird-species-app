from transformers import ViTFeatureExtractor, ViTForImageClassification
from hugsvision.inference.VisionClassifierInference import VisionClassifierInference

def getPred(img='img.jpeg', path=None):
    # model is currently 8 epochs
    if path == None:
        path = './prediction/out/birds525/1/model/'
        path = '/Volumes/ExternalBH/out/BIRDS525/1/model'
    classifier = VisionClassifierInference(
        feature_extractor = ViTFeatureExtractor.from_pretrained(path),
        model = ViTForImageClassification.from_pretrained(path),
    )
    label = classifier.predict(img_path=img)
    return label


if __name__ == '__main__':  
    print(getPred(path='./out/birds525/1/model/'))
