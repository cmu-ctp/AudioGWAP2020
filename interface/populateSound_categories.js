/** Simple js script to populate the sound_categories collection with sounds
    from the sounds collection, for testing purposes. Run in mongo shell. 
    DO NOT RUN ON SERVER!!!!!!!!
*/

if (db.sound_categories.find().count() === 0) {
  const CategoryList = ["Kitchen", "Bathroom", "Living/Bedroom", "Garage", "Ambience", "Concerning"];
  const CategorySubList = [
    ["Sink/Faucet","Garbage Disposal","Garbage Bin","Microwave","Oven","Toaster","Cooktop/Burner","Kettle","Refrigerator","Cooking","Silverware","Plates","Mopping Floor"],
    ["Sink","Bathtub","Shower","Hair Dryer","Mirror Cabinet","Toothbrush","Toilet Flush","Toilet Paper","Washing Hands","Electric Trimmer","Soap Dispenser","Deodorant","Extractor Fan"],
    ["Door","Doorbell","TV","Stereo/Music","Children Playing","Phone Ringing","Keyboard Typing","Window","Chair/Couch","Air Conditioner","Vacuum Cleaner","Fireplace","Clock"],
    ["Garage Door","Car","Bicycle","Motorbike","Tools","Washer","Dryer","Furnace","Water Leaking","Repair","Wood Work"],
    ["Footsteps","Drinking","Eating","Baby Crying","Dog/Cat","Light Switch","Walking","Running","Car Sounds","Bird Sounds","Rain"],
    ["Person Falling","Snoring","Coughing","Sneezing","Call For Help","Smoke Detector","Security Alarm","Glass Breaking"]
  ];
  for (let i = 0; i < 6; i++) {
    let parent = CategoryList[i];
    CategorySubList[i].forEach(sub => {
        let obj = {
            parent: parent,
            sub: sub,
            sounds: []
        }
        db.sound_categories.insertOne(obj)
    });
  }
}

let categories = db.sound_categories.find().toArray()

for (category of categories) {
  let paths = db.sound.find({'meta.category': category.sub}).map(x => x.path)
  db.sound_categories.updateOne(
    {_id: category._id},
    {$push: {sounds: {$each: paths}}})
}