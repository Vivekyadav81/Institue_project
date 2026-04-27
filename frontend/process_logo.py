import sys
import subprocess

try:
    from PIL import Image
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "Pillow"])
    from PIL import Image

def process_logo():
    # Open the image
    img = Image.open('public/logo.jpeg').convert("RGBA")
    datas = img.getdata()

    # 1. First, make white transparent
    newData = []
    for item in datas:
        # Only remove very near-pure-white backgrounds (threshold 245)
        if item[0] > 245 and item[1] > 245 and item[2] > 245:
            newData.append((255, 255, 255, 0))
        else:
            newData.append(item)

    img.putdata(newData)

    # 2. Skip cropping to maintain original proportions/centering if needed
    # but I'll keep the bbox for now just to see, but rename it.

    # Save the cropped and transparent logo
    img.save('public/logo-transparent.png', "PNG")
    print("Successfully created public/logo-transparent.png")

if __name__ == "__main__":
    process_logo()
