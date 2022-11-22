# mongo-uuid-helper

## example (mongo shell)
```bash
# copy uuidHelpers.js raw to mongo shell
var item = db.MyCollection.findOne({ _id: CSUUID("1b06b4bd-b801-45a0-a61c-a2273d6df494") })
item._id.toCSUUID()
# output will be CSUUID("1b06b4bd-b801-45a0-a61c-a2273d6df494")
```
