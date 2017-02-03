function Board(id, title, description, user, updatedDate, tags, collaboratorIds) {
	this.id = id;
	this.title  = title;
	this.description = description;
	this.user = user;
	this.updatedDate = updatedDate;
	this.tags = tags;
	this.collaboratorIds = [];
}

Board.prototype.setId = function(id) {
	this.id = id;

	return this;
}

Board.prototype.setTitle = function(title) {
	this.title = title;

	return this;
}

Board.prototype.setDescription = function(description) {
	this.description = description;

	return this;
}

Board.prototype.setUser = function(user) {
	this.user = user;

	return this;
}

Board.prototype.setUpdatedDate = function(updatedDate) {
	this.updatedDate = updatedDate;

	return this;
}

Board.prototype.setTags = function(tags) {
	this.tags = tags

	return this;
}

Board.prototype.setCollaboratorIds = function(collaboratorIds) {
	this.collaboratorIds = collaboratorIds;

	return this;
}

Board.prototype.getId = function() {
	return this.id;
}

Board.prototype.getTitle = function() {
	return this.title;
}

Board.prototype.getDescription = function() {
	return this.description;
}

Board.prototype.getUser = function() {
	return this.user;
}

Board.prototype.getUpdatedDate = function() {
	return this.updatedDate;
}

Board.prototype.getTags = function() {
	return this.tags;
}

Board.prototype.getTagsAsString = function() {
	return this.tags.join(', ');
}

Board.prototype.isUserCollaborator = function(user) {
	var isIdInCollaboratorIds = this.collaboratorIds.find(function(id) {
		return user.getId() == id;
	})

	return isIdInCollaboratorIds != undefined;
}