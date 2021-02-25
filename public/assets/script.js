const $noteTitle = $('.note-title');
const $noteText = $('.note-textarea');
const $saveNoteBtn = $('.save-note');
const $newNoteBtn = $('.new-note');
const $noteList = $('.list-container .list-group');

// this keeps track of the notes in the textarea
let activeNote = {};

// get yo' notes
const getNotes = () => {
    return $.ajax({
        url: "/api/notes",
        method: "GET",
    });
};

// save note to db
const saveNote = (note) => {
    return $.ajax({
        url: "/api/notes",
        data: note,
        method: "POST"
    });
};

// delete the note from the db
const deleteNote = (id) => {
    return $.ajax({
        url: "api/notes/" + id,
        method: "DELETE",
    });
};

// if there is an active note show it. otherwise render empty input
const activeRenderNotes = () => {
    $saveNoteBtn.hide();

    if (activeNote.id) {
        $noteTitle.attr("readonly", true);
        $noteText.attr("readonly", true);
        $noteTitle.val(activeNote.title);
        $noteText.val(activeNote.text);
    } else {
        $noteTitle.attr("readonly", false);
        $noteText.attr("readonly", false);
        $noteTitle.val("");
        $noteText.val("");
    }
};

//get note data from inputs. save to db. update list.
const handleNoteSave = function () {
    const newNote = {
        title: $noteTitle.val(),
        text: $noteText.val(),
    };
    saveNote(newNote).then(() => {
        inputRenderNotes();
        activeRenderNotes();
    });
};

const handleNoteDelete = function (event) {
    // stop click listener for list from being called when inside button clicked
    event.stopPropagation();

    const note = $(this).parent(".list-group-item").data();

    if (activeNote.id === note.id) {
        activeNote = {};
    }
    deleteNote(note.id).then(() => {
        inputRenderNotes();
        activeRenderNotes();
    });
};


//set activenote and show it
const handleNoteView = function () {
    activeNote = $(this).data();
    activeRenderNotes();
};

//resets activenote to empty for more input
const handleNewNoteView = function () {
    activeNote = {};
    activeRenderNotes();
};

//SUPREME BUTTON CONTROL. hide save button if the fields aren't full.

const handleRenderSaveBtn = function () {
if(!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
} else {
    $saveNoteBtn.show();
}
};

//render note titles
const renderNoteList = (notes) => {
    $noteList.empty();
    
    const noteListItems = [];

    //return jquery object for list with text and delete btn unless deletebutton argument is false
    const create$li = (text, withDeleteButton = true) => {
        const $li = $("<li class='list-group-item'>");
        const $span = $("<span>").text(text);
        $li.append($span);

        if(withDeleteButton) {
            const $delBtn = $("<i class='fas-fa-trash-alt float-right text-danger delete-note'>");
            $li.append($delBtn);
        }
        return $li;
    };

    if (notes.length === 0) {
        noteListItems.push(create$li("No Saved Notes", false));
    };

    notes.forEach((note) => {
        const $li = create$li(note.title).data(note);
        noteListItems.push($li);
    });
    $noteList.append(noteListItems);
};

//get notes from db and render them to sidebar
const inputRenderNotes = () => {
    return getNotes().then(renderNoteList);
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn);

// KOBE THOSE NOTES
inputRenderNotes();
