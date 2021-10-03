const {
  insertNote,
  selectNotesByUserId,
  selectAllAccessorsByNoteId,
  transferOwnership,
  selectNoteByNoteId,
  alterNoteCommunity,
  alterNoteCategories,
  alterNoteAccess,
  selectNoteAccessByNoteIdAndUserId,
  selectAllCategories,
} = require("../../models/note.sql");

async function httpInsertNote(req, res) {
  const newNote = req.body;
  newNote.ownerId = req.userId;
  newNote.createdAt = Date.now();

  if (!newNote.noteTitle || !newNote.dataId) {
    return res.status(400).json({ error: "Missing info" });
  }

  // CREATE note
  //     noteTitle
  //     dataId
  //     createdAt
  try {
    return res.status(201).json(await insertNote(newNote));
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

async function httpSelectUserNotes(req, res) {
  try {
    return res.status(200).json(await selectNotesByUserId(req.userId));
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

async function httpSelectNoteByNoteId(req, res) {
  try {
    return res.status(200).json(await selectNoteByNoteId(req.body.noteId));
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

async function httpTransferOwnership(req, res) {
  try {
    const { noteId, newOwnerId } = req.body;

    return res
      .status(200)
      .json(await transferOwnership(noteId, req.userId, newOwnerId));
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

async function httpSelectAllAccessorsByNoteId(req, res) {
  try {
    if (!req.body.noteId) {
      return res.status(400).json({ error: "Missing noteId" });
    }
    return res
      .status(200)
      .json(await selectAllAccessorsByNoteId(req.body.noteId));
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

async function HttpAlterNoteCommunity(req, res) {
  try {
    if (!req.body.noteId || !req.body.communityId) {
      return res.status(400).json({ error: "Missing noteId" });
    }
    if (req.body.command != "INSERT" || req.body.command != "DELETE") {
      return res.status(400).json({ error: "Wrong command" });
    }
    return res
      .status(200)
      .json(
        await alterNoteCommunity(
          req.body.command,
          req.body.noteId,
          req.body.communityId
        )
      );
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

async function HttpAlterNoteCategories(req, res) {
  try {
    if (!req.body.noteId || !req.body.categories) {
      return res.status(400).json({ error: "Missing noteId" });
    }
    if (req.body.command != "INSERT" || req.body.command != "DELETE") {
      return res.status(400).json({ error: "Wrong command" });
    }
    return res
      .status(200)
      .json(
        await alterNoteCategories(
          req.body.command,
          req.body.noteId,
          req.body.categories
        )
      );
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

async function HttpAlterNoteAccess(req, res) {
  try {
    if (!req.body.noteId || !req.body.userId || !req.body.accessStatus) {
      return res.status(400).json({ error: "Missing noteId" });
    }
    if (
      req.body.command != "INSERT" ||
      req.body.command != "DELETE" ||
      req.body.command != "UPDATE"
    ) {
      return res.status(400).json({ error: "Wrong command" });
    }
    return res
      .status(200)
      .json(
        await alterNoteAccess(
          req.body.command,
          req.body.noteId,
          req.body.accessStatus
        )
      );
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

async function httpSelectNoteAccessByNoteIdAndUserId(req, res) {
  try {
    return res
      .status(200)
      .json(
        await selectNoteAccessByNoteIdAndUserId(req.body.noteId, eq.body.userId)
      );
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

async function httpSelectAllCategories(req, res) {
  try {
    return res
      .status(200)
      .json(
        await selectAllCategories()
      );
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
}

module.exports = {
  httpInsertNote,
  httpSelectUserNotes,
  httpTransferOwnership,
  httpSelectAllAccessorsByNoteId,
  httpSelectNoteByNoteId,
  HttpAlterNoteCommunity,
  HttpAlterNoteCategories,
  HttpAlterNoteAccess,
  httpSelectNoteAccessByNoteIdAndUserId,
  httpSelectAllCategories
};
