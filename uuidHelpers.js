// Javascript helper functions for parsing and displaying UUIDs in the MongoDB shell.
// This is a temporary solution until SERVER-3153 is implemented.
// To create BinData values corresponding to the various driver encodings use:
//      var s = "{00112233-4455-6677-8899-aabbccddeeff}";
//      var uuid = UUID(s); // new Standard encoding
//      var juuid = JUUID(s); // JavaLegacy encoding
//      var csuuid = CSUUID(s); // CSharpLegacy encoding
//      var pyuuid = PYUUID(s); // PythonLegacy encoding
// To convert the various BinData values back to human readable UUIDs use:
//      uuid.toUUID()     => 'UUID("00112233-4455-6677-8899-aabbccddeeff")'
//      juuid.ToJUUID()   => 'JUUID("00112233-4455-6677-8899-aabbccddeeff")'
//      csuuid.ToCSUUID() => 'CSUUID("00112233-4455-6677-8899-aabbccddeeff")'
//      pyuuid.ToPYUUID() => 'PYUUID("00112233-4455-6677-8899-aabbccddeeff")'
// With any of the UUID variants you can use toHexUUID to echo the raw BinData with subtype and hex string:
//      uuid.toHexUUID()   => 'HexData(4, "00112233-4455-6677-8899-aabbccddeeff")'
//      juuid.toHexUUID()  => 'HexData(3, "77665544-3322-1100-ffee-ddccbbaa9988")'
//      csuuid.toHexUUID() => 'HexData(3, "33221100-5544-7766-8899-aabbccddeeff")'
//      pyuuid.toHexUUID() => 'HexData(3, "00112233-4455-6677-8899-aabbccddeeff")'

// usage
/*
# copy uuidHelpers.js raw to mongo shell
var item = db.MyCollection.findOne({ _id: CSUUID("1b06b4bd-b801-45a0-a61c-a2273d6df494") })
item._id.toCSUUID()
// output will be CSUUID("1b06b4bd-b801-45a0-a61c-a2273d6df494")

"1b06b4bd-b801-45a0-a61c-a2273d6df494".toBinDataString()
// output BinData(3, "vbQGGwG4oEWmHKInPW30lA==")
var item = db.MyCollection.findOne({ _id: BinData(3, "vbQGGwG4oEWmHKInPW30lA==") })
*/


function HexToBase64(hex) {
    var base64Digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var base64 = "";
    var group;
    for (var i = 0; i < 30; i += 6) {
        group = parseInt(hex.substr(i, 6), 16);
        base64 += base64Digits[(group >> 18) & 0x3f];
        base64 += base64Digits[(group >> 12) & 0x3f];
        base64 += base64Digits[(group >> 6) & 0x3f];
        base64 += base64Digits[group & 0x3f];
    }
    group = parseInt(hex.substr(30, 2), 16);
    base64 += base64Digits[(group >> 2) & 0x3f];
    base64 += base64Digits[(group << 4) & 0x3f];
    base64 += "==";
    return base64;
}

function UUID(uuid) {
    var hex = uuid.replace(/[{}-]/g, ""); // remove extra characters
    var base64 = HexToBase64(hex);
    return new BinData(4, base64); // new subtype 4
}

function JUUID(uuid) {
    var hex = uuid.replace(/[{}-]/g, ""); // remove extra characters
    var msb = hex.substr(0, 16);
    var lsb = hex.substr(16, 16);
    msb = msb.substr(14, 2) + msb.substr(12, 2) + msb.substr(10, 2) + msb.substr(8, 2) + msb.substr(6, 2) + msb.substr(4, 2) + msb.substr(2, 2) + msb.substr(0, 2);
    lsb = lsb.substr(14, 2) + lsb.substr(12, 2) + lsb.substr(10, 2) + lsb.substr(8, 2) + lsb.substr(6, 2) + lsb.substr(4, 2) + lsb.substr(2, 2) + lsb.substr(0, 2);
    hex = msb + lsb;
    var base64 = HexToBase64(hex);
    return new BinData(3, base64);
}

function CSUUID(uuid) {
    var hex = uuid.replace(/[{}-]/g, ""); // remove extra characters
    var a = hex.substr(6, 2) + hex.substr(4, 2) + hex.substr(2, 2) + hex.substr(0, 2);
    var b = hex.substr(10, 2) + hex.substr(8, 2);
    var c = hex.substr(14, 2) + hex.substr(12, 2);
    var d = hex.substr(16, 16);
    hex = a + b + c + d;
    var base64 = HexToBase64(hex);
    return new BinData(3, base64);
}

function PYUUID(uuid) {
    var hex = uuid.replace(/[{}-]/g, ""); // remove extra characters
    var base64 = HexToBase64(hex);
    return new BinData(3, base64);
}

BinData.prototype.toHex = function () { 
    return this.toString("hex");
}

BinData.prototype.toUUID = function () {
    var hex = this.toHex();
    var uuid = hex.substr(0, 8) + '-' + hex.substr(8, 4) + '-' + hex.substr(12, 4) + '-' + hex.substr(16, 4) + '-' + hex.substr(20, 12);
    return 'UUID("' + uuid + '")';
}

BinData.prototype.toJUUID = function () {
    var hex = this.toHex();
    var msb = hex.substr(0, 16);
    var lsb = hex.substr(16, 16);
    msb = msb.substr(14, 2) + msb.substr(12, 2) + msb.substr(10, 2) + msb.substr(8, 2) + msb.substr(6, 2) + msb.substr(4, 2) + msb.substr(2, 2) + msb.substr(0, 2);
    lsb = lsb.substr(14, 2) + lsb.substr(12, 2) + lsb.substr(10, 2) + lsb.substr(8, 2) + lsb.substr(6, 2) + lsb.substr(4, 2) + lsb.substr(2, 2) + lsb.substr(0, 2);
    hex = msb + lsb;
    var uuid = hex.substr(0, 8) + '-' + hex.substr(8, 4) + '-' + hex.substr(12, 4) + '-' + hex.substr(16, 4) + '-' + hex.substr(20, 12);
    return 'JUUID("' + uuid + '")';
}

BinData.prototype.toCSUUID = function () {
    var hex = this.toHex();
    var a = hex.substr(6, 2) + hex.substr(4, 2) + hex.substr(2, 2) + hex.substr(0, 2);
    var b = hex.substr(10, 2) + hex.substr(8, 2);
    var c = hex.substr(14, 2) + hex.substr(12, 2);
    var d = hex.substr(16, 16);
    hex = a + b + c + d;
    var uuid = hex.substr(0, 8) + '-' + hex.substr(8, 4) + '-' + hex.substr(12, 4) + '-' + hex.substr(16, 4) + '-' + hex.substr(20, 12);
    return 'CSUUID("' + uuid + '")';
}

BinData.prototype.toPYUUID = function () {
    var hex = this.toHex();
    var uuid = hex.substr(0, 8) + '-' + hex.substr(8, 4) + '-' + hex.substr(12, 4) + '-' + hex.substr(16, 4) + '-' + hex.substr(20, 12);
    return 'PYUUID("' + uuid + '")';
}


BinData.prototype.toHexUUID = function () {
    var hex = this.toHex();
    var uuid = hex.substr(0, 8) + '-' + hex.substr(8, 4) + '-' + hex.substr(12, 4) + '-' + hex.substr(16, 4) + '-' + hex.substr(20, 12);
    var subType = this.subtype ? this.subtype() : this.sub_type;
    return 'HexData(' + subType + ', "' + uuid + '")';
}

function TestUUIDHelperFunctions() {
    var s = "{00112233-4455-6677-8899-aabbccddeeff}";
    var uuid = UUID(s);
    var juuid = JUUID(s);
    var csuuid = CSUUID(s);
    var pyuuid = PYUUID(s);
    print(uuid.toUUID());
    print(juuid.toJUUID());
    print(csuuid.toCSUUID());
    print(pyuuid.toPYUUID());
    print(uuid.toHexUUID());
    print(juuid.toHexUUID());
    print(csuuid.toHexUUID());
    print(pyuuid.toHexUUID());
}

BinData.prototype.toCSUUID = function () {
    var hex = this.toHex();
    var a = hex.substr(6, 2) + hex.substr(4, 2) + hex.substr(2, 2) + hex.substr(0, 2);
    var b = hex.substr(10, 2) + hex.substr(8, 2);
    var c = hex.substr(14, 2) + hex.substr(12, 2);
    var d = hex.substr(16, 16);
    hex = a + b + c + d;
    var uuid = hex.substr(0, 8) + '-' + hex.substr(8, 4) + '-' + hex.substr(12, 4) + '-' + hex.substr(16, 4) + '-' + hex.substr(20, 12);
    return 'CSUUID("' + uuid + '")';
}

// uid to base64
String.prototype.toBase64 = function () {
    var uuid = `${this.split(/"|'/).length == 3 ? this.split(/"|'/)[1] : this}`.replace(/[{}-]/g, "");
    var a = uuid.substr(6, 2) + uuid.substr(4, 2) + uuid.substr(2, 2) + uuid.substr(0, 2);
    var b = uuid.substr(10, 2) + uuid.substr(8, 2);
    var c = uuid.substr(14, 2) + uuid.substr(12, 2);
    var d = uuid.substr(16, 16);
    hex = a + b + c + d;
    return HexToBase64(hex);
}

// uid to bin data
String.prototype.toBinData = function () {
    var base64 = `${this}`.toBase64()
    return new BinData(3, base64);
}

// uid to bin data string
String.prototype.toBinDataString = function () {
    var base64 = `${this}`.toBase64()
    return `BinData(3, "${base64}")`;
}
