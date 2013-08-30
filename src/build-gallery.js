#!/usr/bin/env node

var fs = require('node-fs');




var GALLERY = 'gallery',
    PREFIX = 'y3d',
    COLOR = {
        GREEN: '\033[1;32m',
        ORANGE: '\033[31m',
        RESET: '\033[0m'
    },
    galleryDir = [GALLERY, PREFIX].join('-'),
    buildJson = {
        name: [GALLERY, PREFIX].join('-'),
        builds: {
            'gallery-y3d': {
                jsfiles: []
            }
        }
    },
    metaJson = {
        'gallery-y3d': {
            requires: []
        }
    };

// create this tree if it's not already available
/*
-+ gallery-y3d/
 |
 +- js/
 |  |
 |  +-
 |
 +- meta/
 |  |
 |  +- gallery-y3d.json
 |
 +- build.json
 +- HISTORY.md
 +- README.md
*/
fs.mkdirSync(galleryDir + '/js', 0777, true);
fs.mkdirSync(galleryDir + '/meta', 0777, true);
fs.writeFile(galleryDir + '/meta/gallery-y3d.json');

if (!fs.existsSync(galleryDir + '/build.json')) {
    fs.writeFile(galleryDir + '/build.json', JSON.stringify(buildJson));
} else {
    updateBuildFile();
};

if (!fs.existsSync(galleryDir + '/HISTORY.md')) {
    fs.writeFile(galleryDir + '/HISTORY.md', "gallery-y3d\n========\n\n@VERSION@\n------\n* Initial build")
};

if (!fs.existsSync(galleryDir + '/README.md')) {
    fs.writeFile(galleryDir + '/README.md', "gallery-y3d\n========\n")
};


fs.readdir('./', processDirs);


function processDirs (err, files) {
    files.forEach(function (file) {
        if (file.indexOf('y3d-') === 0) {
            // directory is correct
            if (fs.statSync('./' + file).isDirectory()) {
                processDir('./' + file);
            }
        }
    });
}

function processDir (dir) {
    console.log('Working with `' + dir + '`');
    var exists = fs.existsSync(dir + '/js');

    if (exists) {
        fs.readdirSync(dir + '/js').forEach(function (jsFile) {
            copyFile(dir + '/js/' + jsFile, galleryDir + '/js/' + jsFile, function (err) {
                if (err) {
                    _log(jsFile + ' : ' + err, false);
                } else {
                    _log('Write JS file: ' + jsFile, true);
                    buildJson.builds['gallery-y3d'].jsfiles.push(jsFile);
                    updateBuildFile();

                    // copy meta file requires over, unless it's a "y3d" file
                    fs.readdir(dir + '/meta', function (err, files) {
                        files.forEach(function (file) {
                            if (file.slice(-4) === 'json') { // if we are in a json file
                                fs.readFile(dir + '/meta/' + file, function (err, data) {
                                    if (err) {
                                        console.log(dir + '/meta/' + file);
                                        throw err;
                                    }

                                    var _json = JSON.parse(data.toString() || '{}');

                                    var p, config;

                                    for (p in _json) {
                                        config = _json[p];

                                        if (config.requires) {
                                            config.requires.forEach(function (required) {
                                                if (required.indexOf('y3d') !== 0) {
                                                    if (metaJson['gallery-y3d'].requires.indexOf(required) === -1) {
                                                        metaJson['gallery-y3d'].requires.push(required);
                                                        updateMetaFile();
                                                        _log('Copied meta file for: ' + dir + '/meta/' + file, true)
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }
                        });
                    });
                }
            });
        });
    }
}


function copyFile(source, target, cb) {
    var cbCalled = false;

    var rd = fs.createReadStream(source);
    rd.on("error", function(err) {
        done(err);
    });

    var wr = fs.createWriteStream(target);
    wr.on("error", function(err) {
        done(err);
    });
    wr.on("close", function(ex) {
        done();
    });

    rd.pipe(wr);

    function done(err) {
        if (!cbCalled) {
            cb(err);
            cbCalled = true;
        }
    }
}

function updateBuildFile() {
    fs.readFile(galleryDir + '/build.json', function (err, data) {
        if (err) {
            throw err;
        }

        if (data.toString() === 'undefined') {
            data = '{builds:{"gallery-y3d":{}}}';
        }
        var _json = JSON.parse(data);

        _json.name = buildJson.name;
        _json.builds['gallery-y3d'] = _mix(_json.builds['gallery-y3d'], buildJson.builds['gallery-y3d']);

        fs.writeFile(galleryDir + '/build.json', JSON.stringify(_json, null, 4));
    });
}

function updateMetaFile() {
    fs.readFile(galleryDir + '/meta/gallery-y3d.json', function (err, data) {
        if (err) {
            throw err;
        }

        if (data.toString() === 'undefined') {
            data = '{}';
        }
        var _json = JSON.parse(data);

        _json['gallery-y3d'] || (_json['gallery-y3d'] = {});
        _json['gallery-y3d'].requires = metaJson['gallery-y3d'].requires;

        fs.writeFile(galleryDir + '/meta/gallery-y3d.json', JSON.stringify(_json, null, 4));
    });
}

function _log(msg, success) {
    var _msg = '';
    if (success === true) {
        _msg = COLOR.GREEN + '✔' + COLOR.RESET;
    } else if (success === false) {
        _msg = COLOR.ORANGE + '✗' + COLOR.RESET
    }

    console.log(_msg + ' ' + msg);
}

function _mix () {
    var _obj = {},
        args = Array.prototype.slice.call(arguments);

    args.forEach(function (obj) {
        var p;
        for (p in obj) {
            _obj[p] = obj[p];
        }
    });

    return _obj;
}


