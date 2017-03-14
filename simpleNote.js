// track how many notes are saved in localStorage, start a new note afterwards.
let existingIds = [];
for(let i = 0; i < localStorage.length; i++) {
    let key = localStorage.key(i);
    let id = key.replace('simpleNote-', "");
    existingIds.push(parseInt(id))
}
let noteId = Math.max(...existingIds, 0);

function newNote() {
    document.getElementById("editor").style.display = "inline-block";

    // clear input area when starting new note
    clearFormat();
}

function saveNote() {
    let input = $('#noteInput');
    let note = input.text();
    if (note == "") {
        alert("Note field cannot be empty!");
        return
    }
    let inputDataId = input.attr('data-id');
    let noteColor = input.attr('data-color');
    if (inputDataId != "") { // editing existing note
        noteId = inputDataId
    } else { // new note
        noteId = parseInt(noteId) + 1;
    }
    let storageKey = noteId;
    let storageValue = {'color':noteColor, 'note':note};
    localStorage.setItem(`simpleNote-${storageKey}`, JSON.stringify(storageValue)); //add a prefix to prevent mixing with other localStorage items.
    readFromLocalStorage();

    // clear input format and attribute after saving notes.
    clearFormat()
}

function cancelNote() {
    let input = $('#noteInput');
    let inputDataId = input.attr('data-id');
    if (inputDataId != "") {//cancel for editing note would be resetting input area
        let originalNote = $(`#note-${inputDataId}`).text();
        let originalColor = $(`#note-${inputDataId}`).css('color');
        input.text(originalNote);
        input.css("color", originalColor)
    } else {//cancel for new note would be just abandoning the operation
        document.getElementById("editor").style.display = "none";
    }
}

function editNote(noteId){
    let input = $('#noteInput');
    document.getElementById("editor").style.display = "inline-block";
    let note = $(`#note-${noteId}`).text();
    let color = $(`#note-${noteId}`).css('color');
    input.text(note);
    input.css("color", color);
    input.attr('data-id', noteId);
    input.attr("data-color", color);
}

function deleteNote(noteId) {
    let deleteConfirm = confirm('Are you sure you want to delete this note?');
    if (deleteConfirm) {
        localStorage.removeItem(`simpleNote-${noteId}`);
        readFromLocalStorage();
    }
}

function addColor(color) {
    let input = $('#noteInput');
    input.css("color", color);
    input.attr("data-color", color);
}


function readFromLocalStorage(){
    $("#noteList").empty();
    for(let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        if (!key.includes('simpleNote-')) {
            continue
        }
        let value = JSON.parse(localStorage.getItem(key));
        let note = value['note'];
        let color = value['color'];
        let noteId = key.replace('simpleNote-', "");
        $("#noteList").append(`<ul>
                                    <li id="${noteId}">
                                        <div id="note-${noteId}" style="color:${color};">${note}</div><br>
                                        <button class="smallBtn" onclick="editNote('${noteId}')"> Edit </button>
                                        <button class="smallBtn" onclick="deleteNote('${noteId}')"> Delete </button>
                                    </li>
                                </ul>`
        );
    }
}

function clearFormat() {
    let input = $('#noteInput');
    input.text("");
    input.attr("data-id", "");
    input.css("color", "");
    input.attr("data-color", "");
}

$(document).ready(function(){
    readFromLocalStorage();
});

