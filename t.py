import qrcode

# Data to encode in the QR code (e.g., a URL or text)
data = "https://kamski18.github.io/kurus/index.html"

# Generate the QR code image
img = qrcode.make(data)

# Save the image as a file
img.save("my_qrcode.png")
