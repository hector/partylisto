/* Create a cache object */
//var cache = new LastFMCache();

/* Create a LastFM object */
var lastfm = new LastFM({
    apiKey    : 'e7724ac95d105a0c18dacd9f98aa764f',
    apiSecret : 'cddbd7836d23960728d93a11d8a98f6f'
    //cache : cache
});

var attendees = { user: []}, // Create empty object of attendees
    stime = 10, // sleep time to be nice with api calls
    eventId = '3546832', // Sonar event 3408485
    nTopTracksPerUser = 100,
    nResults = 100,
    sortResults = true,
    tracks = [];

// main function
function search() {
    fillEventAttendees()
}

var errorCallback = function(code, message){
    alert(code + ': ' + message);
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

// Find a song in the array of songs
function indexOfTrack(track) {
    var _track, index = -1
    for(var i=0; i < tracks.length; i++) {
        _track = tracks[i]
        if((_track.mbid!="" && _track.mbid==track.mbid) ||
            (_track.name==track.name && _track.artist.name==track.artist.name)) {
            index = i
            break
        }
    }
    return index
}

function getMaxPlaycount() {
    var playcount = 0;
    for(var i=0; i < tracks.length; i++) {
        if(playcount < tracks[i].playcount) playcount = tracks[i].playcount
    }
    return playcount
}

// Collects all the event's attendees
function fillEventAttendees() {
    setProgressMsg("Loading attendees...")
    fillEventAttendeesRecurs(1, 100)
}

function fillEventAttendeesRecurs(page, perPage) {
    lastfm.event.getAttendees({event: eventId, page: page, limit: perPage}, {
        success: function(data) {
            attendees.user = attendees.user.concat(data.attendees.user)
            attendees['@attr'] = data.attendees['@attr']
            setProgress(attendees.user.length * 10 / parseInt(data.attendees['@attr'].total))
            if(parseInt(page) < parseInt(data.attendees['@attr'].totalPages)) {
                sleep(stime)
                fillEventAttendeesRecurs(page+1, perPage)
            } else getTopTracks();
        },  error: errorCallback
    });
}

// Adds topTracks to attendees
function getTopTracks() {
    setProgressMsg("Loading user top tracks...")
    if(attendees.user.length == 0) return;
    getTopTracksRecurs(0)
}

function getTopTracksRecurs(index) {
    lastfm.user.getTopTracks({user: attendees.user[index].name, period: 'overall', limit: nTopTracksPerUser, page: 1}, {
        success: function(data) {
            if(data.toptracks.track) {// avoid users with no toptracks
                // Loop over tracks and save them in their array
                var _track, _index, _tracks = data.toptracks.track
                for(var j = 0; j < _tracks.length; j++) {
                    _track = _tracks[j]
                    _index = indexOfTrack(_track) // Already in the list
                    _track.playcount = parseInt(_track.playcount)
                    if(_index == -1) { // not in the list
                        _index = tracks.length
                        _track.score = _track.playcount
                        _track.users = [attendees.user[index]]
                        _track.usersPlaycount = [_track.playcount]
                        tracks[_index] = _track
                    } else {
                        tracks[_index].playcount += _track.playcount
                        tracks[_index].users.push(attendees.user[index])
                        tracks[_index].usersPlaycount.push(_track.playcount)
                    }
                }
            }
            setProgress(10 + (tracks.length * 90 / (attendees.user.length * nTopTracksPerUser)))

            if(index+1 < attendees.user.length) {
                sleep(stime)
                getTopTracksRecurs(index+1)
            } else sortTracks()
        }, error : errorCallback
    })
}

function sortTracks() {
    setProgressMsg("Generating playlist...")
    tracks.sort(function(a,b) {
        var subs = b.users.length - a.users.length
        if(subs == 0) return b.playcount - a.playcount
        else return subs
    })

    sliceTracks()
}

function sliceTracks() {
    tracks = tracks.slice(0, nResults)
    randomizeTracks()
}

function randomizeTracks() {
    if(!sortResults) {
        tracks.sort(function(a,b) {
            Math.floor(Math.random()*11) - 5
        })
    }
    fillTable()
}

function fillTable() {
    var _tbody = $("#tracks-table tbody"),
        _track;
    for(var i = 0; i < tracks.length; i++) {
        _track = tracks[i];
        addRow(_tbody, i+1, _track)
    }
    finished()
}

function addRow(tbody, num, track) {
    return tbody.append("<tr>" +
            "<td>" + num + "</td>" +
            "<td><a target='_blank' href='" + track.url + "'>" + track.name + "</a></td>" +
            "<td><a target='_blank' href='" + track.artist.url + "'>" + track.artist.name + "</a></td>" +
            "<td><i class='icon-user'></i>(" + track.users.length + ")</td>" +
            "<td>" + track.playcount + "</td>" +
            "</tr>")
}

function finished() {
    setProgress(100)
    setProgressMsg("Finished!")
    $('#generation').slideToggle()
    $('#progress').slideToggle()
    $('#tracks-table').fadeIn()
}

// ###################################

$('#btn-20').click(function() { nResults = 20 })
$('#btn-50').click(function() { nResults = 50 })
$('#btn-100').click(function() { nResults = 100 })
$('#btn-500').click(function() { nResults = 500 })
$('#btn-ordered').click(function() { sortResults = true })
$('#btn-random').click(function() { sortResults = false })
$('#prefs-icon').click(function() { $("#prefs").slideToggle() })

$('#btn-generate').click(function() {
    eventId = parseInt($('#event-id').val())
    attendees = { user: []}
    tracks = []
    $("#tracks-table tbody").html("")
    setProgressMsg("Starting...")
    setProgress(0)
    $('#generation').slideToggle()
    $('#prefs').hide()
    $('#progress').slideToggle()
    fillEventAttendees()
})

function setProgressMsg(msg) {
    $('#progress-txt').html(msg)
}
function setProgress(percentage) {
    var progressBar = $('#progress-bar')
    progressBar.width(progressBar.parent().width() * percentage / 100)
}



