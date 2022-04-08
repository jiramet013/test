import pymongo
import time
myclient = pymongo.MongoClient("mongodb://arm:1234@cluster0-shard-00-00.qoei9.mongodb.net:27017,cluster0-shard-00-01.qoei9.mongodb.net:27017,cluster0-shard-00-02.qoei9.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-6j3ef8-shard-0&authSource=admin&retryWrites=true&w=majority")
mydb = myclient["mydatabase"]
mycol = mydb["customers"]
if __name__ == '__main__':
    try:
        while True:
            for x in mycol.find({},{ "_id": 0, "name": 1}).sort("_id", -1).limit(1):
            
             print(x)
            time.sleep(1)
 
        # Reset by pressing CTRL + C
    except KeyboardInterrupt:
        print("Measurement stopped by User")
        
