import pymongo
import base64
import requests

import sys

# Check if the correct number of arguments were provided
if len(sys.argv) != 2:
    print("Usage: python updatedbiot.py <my_variable>")
    sys.exit(1)

# Get the passed argument and convert it to an integer
try:
    my_variable = int(sys.argv[1])
except ValueError:
    print("The argument must be an integer.")
    sys.exit(1)

# Use the variable as needed in your script
print("The passed variable is:", my_variable)

# Calculate the new variable based on whether my_variable is even or odd
new_variable = 0 if my_variable % 2 == 0 else 1
print("The new variable is:", new_variable)


# MongoDB Atlas connection URI
MONGO_URI = "mongodb://jawadhaider682:Ep8km9btNMhWJa0x@ac-puxt79s-shard-00-00.owke4n8.mongodb.net:27017,ac-puxt79s-shard-00-01.owke4n8.mongodb.net:27017,ac-puxt79s-shard-00-02.owke4n8.mongodb.net:27017/?ssl=true&replicaSet=atlas-jx0038-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0"

# Client ID from your Imgur application
client_id = 'b841234729f0d21'

# Path to your image
image_path = 'received_image.jpg'

# Read the binary file and encode it
with open(image_path, "rb") as image_file:
    encoded_string = base64.b64encode(image_file.read())

url = "https://api.imgur.com/3/image"
payload = {'image': encoded_string}
headers = {'Authorization': 'Client-ID ' + client_id}

# First, upload an image to Imgur
imgur_response = requests.post(url, headers=headers, data=payload)

most_confident_plate_number = ""

if imgur_response.status_code == 200:
    try:
        # Get the image link
        image_link = imgur_response.json()['data']['link']
        print("Image uploaded successfully. Link:", image_link)

        # Number plate detection
        url = "https://openalpr.p.rapidapi.com/recognize_url"
        querystring = {"country": "eu"}
        payload = {"image_url": image_link}
        headers = {
            "content-type": "application/x-www-form-urlencoded",
            "X-RapidAPI-Key": "ae8adf0096mshce5307163e52132p1895a3jsnb07be5907431",
            "X-RapidAPI-Host": "openalpr.p.rapidapi.com"
        }
        response = requests.post(url, data=payload, headers=headers, params=querystring)

        data = response.json()
        if 'results' in data and data['results']:
            plates = data['results'][0]['candidates']
            most_confident_plate = max(plates, key=lambda x: x['confidence'])
            most_confident_plate_number = most_confident_plate['plate']
            most_confident_plate_confidence = most_confident_plate['confidence']
            print("Most confident plate:", most_confident_plate_number, "with confidence:", most_confident_plate_confidence)

        else:
            print("No plates detected in the image.")
    except KeyError:
        print("Error: Could not retrieve image link from Imgur response.")

print("Most confident plate number:", most_confident_plate_number)

newone=0

# Connect to MongoDB Atlas
try:
    client = pymongo.MongoClient(MONGO_URI)
    db = client.test  # Change to your database name
    collection = db.admins  # Change to your collection name

    # Find document with userName "DaftarKhwan"
    document = collection.find_one({"userName": "Pearl Continental"})

    if document:
        floorsPlan = document.get('floorsPlan', [])
        # If no available slot found, find and update the booked slot with the same plate number
        found_slot = False
        for floor in floorsPlan:
            for row in floor:
                for cell in row:
                    if cell['name'] == "Slot" and cell['vehicle'] == most_confident_plate_number and cell['vehicle'] !=""  and cell['status'] == "filled":
                        cell['status'] = "available"
                        cell['vehicle'] = ""
                        newone=1;
                        found_slot = True
                        collection.update_one(
                            {"_id": document["_id"]},
                            {"$set": {"floorsPlan": floorsPlan}}
                        )
                        break
                if found_slot:
                    break
            if found_slot:
                break

        if found_slot:
            print(f"Slot with plate number '{most_confident_plate_number}' updated to 'Available'.")
        else:
            # Iterate through the floorsPlan array to find the first cell that matches the criteria
            
            # Wrong now : task to do yet : update to filled when already booked by same vehicle number, booked from mobile app, change to available when same vehicle again come to this sensor or camera and remove vehilce number form cell object 
            
            for floor in floorsPlan:
                for row in floor:
                    for cell in row:
                        if cell['name'] == "Slot" and cell['vehicle'] == most_confident_plate_number and cell['vehicle'] !="" and (cell['status'] == "Booked" or cell['status'] == "booked") and new_variable == 0:
                            cell['status'] = "filled"
                            cell['vehicle'] = most_confident_plate_number
                            collection.update_one(
                                {"_id": document["_id"]},
                                {"$set": {"floorsPlan": floorsPlan}}
                            )
                            print("Status updated successfully for document with userName 'Pearl Continental'")
                            newone=1
                            exit()
                        else:
                            if cell['name'] == "Slot" and cell['vehicle'] == most_confident_plate_number and cell['vehicle'] !="" and (cell['status'] == "Booked" or cell['status'] == "booked") and new_variable == 1:
                                print("Entry Successful")
                                newone=1
                                exit()                        
                            else:
                                if cell['name'] == "Slot" and cell['status'] == "available" and new_variable == 1:
                                    print(cell['status'])
                                    print("available")
        if newone==0 and most_confident_plate_number != "" and new_variable == 1 :
            for floor in floorsPlan:
                for row in floor:
                    for cell in row:
                        if cell['name'] == "Slot" and cell['status'] == "available":
                            cell['status'] = "booked"
                            cell['vehicle'] = most_confident_plate_number
                            
                            cost = int(cell['cost'])
                            collection.update_one(
                                {"_id": document["_id"]},
                                {
                                    "$set": {"floorsPlan": floorsPlan},
                                    "$inc": {"netProfit": cost}
                                }
                            )
                            
                            collection.update_one(
                                {"_id": document["_id"]},
                                {"$set": {"floorsPlan": floorsPlan}}
                            )
                            
                            print(f"Automatically booked slot for Vehicle having number '{most_confident_plate_number}'.")
                            exit()
        if newone==0 and most_confident_plate_number != "" and new_variable == 0 :
            print(f"Initiate Buzzer as '{most_confident_plate_number}' vehicle has no booking at this slot.")
            exit()
            
                
    else:
        print("Document with userName 'DaftarKhwan' not found.")

except pymongo.errors.ConnectionFailure:
    print("Failed to connect to the database.")
