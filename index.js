var fs = require('fs');
var path = require('path')

var path_arg = 2;
var exclude_arg = 4;
var type_arg = 3;

// console.log("********************")
// console.log(process.argv)
// console.log("********************")

var folder_path = process.argv[path_arg];
if (!folder_path) {
    console.log("please provide a path")
    console.log("Use command as node index.js <DIR> [-e test done etc] [-ft .avi .mp3 .mp4]")
    process.exit();
}

var file_type_index = process.argv.indexOf("-ft")
var exclude_list_index = process.argv.indexOf("-e")

if (exclude_list_index != -1) {
    if (file_type_index == -1 || file_type_index < exclude_list_index)
        var exclude_extension = getArrayList(exclude_list_index + 1, process.argv.length, process.argv)
    else {
        var exclude_extension = getArrayList(exclude_list_index + 1, file_type_index, process.argv)
    }
}
else {
    var exclude_extension = [];
}

if (file_type_index == -1)
    var file_types = [".avi", ".mkv", ".mp4"];
else {
    if (exclude_list_index == -1 || exclude_list_index < file_type_index)
        var file_types = getArrayList(file_type_index + 1, process.argv.length, process.argv)
    else {
        var file_types = getArrayList(file_type_index + 1, exclude_list_index, process.argv)
    }
}

try {
    var root_path = fs.statSync(folder_path);

    if (!root_path.isDirectory()) {
        console.log("Specified path is not a directory");
        process.exit();
    }
    var filelist = recursiveRead(folder_path);
    console.log("Number of items found = " + filelist.length);

    if (filelist.length <= 5) {
        console.log("Check this out these => ")
        console.log(filelist)
    }
    else {
        var item = filelist[Math.floor(Math.random() * filelist.length)];
        console.log("check this out this => %s", path.basename(item))
    }

    console.log("Located at %s", item)

} catch (error) {
    console.error(error);
}
process.exit();



function recursiveRead(file_path) {
    var return_list = [];
    fs.readdirSync(file_path).forEach(function(element) {
        var filePath = file_path + element;
        if (!isUnixHiddenPath(filePath)) {
            var file = fs.statSync(filePath);
            fs.accessSync(filePath);
            if (file.isDirectory()) {
                if (!isExcludeFolder(filePath))
                    return_list.push.apply(return_list, recursiveRead(filePath + "/"));
            }
            else if (file.isFile()) {
                var ext = path.extname(filePath);
                if (file_types.indexOf(ext) !== -1)
                    return_list.push(filePath)
            }
        }
    }, this);
    return return_list;
}

function isUnixHiddenPath(path) {
    return (/(^|\/)\.[^\/\.]/g).test(path);
};
function isExcludeFolder(path) {
    var return_val = false;
    exclude_extension.every(function(element) {
        if (path.search(element) != -1) {
            return_val = true;
        }
    });
    return return_val;
};


function getArrayList(start_index, end_index, array_input) {
    var return_Arr = [];
    for (var i = start_index; i < end_index; i++) {
        return_Arr.push(array_input[i])
    }
    return return_Arr
}