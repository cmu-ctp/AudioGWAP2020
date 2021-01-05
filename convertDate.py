
ifile = open('data.csv')
ofile = open('out.csv', 'w')

lines = ifile.readlines()
print('[')
for line in lines:
    tokens = line.split(",")
    first = tokens[0].split('"')[1]
    second = tokens[1].split('"')[1]

    print('["' + first + '","' + second + '"],')
print(']')

ifile.close()
ofile.close()

# String.prototype.toHHMMSS = function () {
#     var sec_num = parseInt(this, 10); // don't forget the second param
#     var hours   = Math.floor(sec_num / 3600);
#     var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
#     var seconds = sec_num - (hours * 3600) - (minutes * 60);

#     if (hours   < 10) {hours   = "0"+hours;}
#     if (minutes < 10) {minutes = "0"+minutes;}
#     if (seconds < 10) {seconds = "0"+seconds;}
#     return hours+':'+minutes+':'+seconds;
# }

# function convert(times) {
#     for (let time of times) {
#         let diff = new Date(time[1]).getTime() - new Date(time[0]).getTime()
#         console.log(time[0], time[1], new String(Math.floor(diff/1000)).toHHMMSS())
#     }
# }
