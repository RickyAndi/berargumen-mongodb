function Card(id, title, content, type, top, left, user, cardId) {
	this.id = id;
	this.title = title;
	this.content = content;
	this.type = type;
	this.top = top;
	this.left = left;
	this.creator = user;
	this.relatedTo = cardId;
}

Card.prototype.getId = function() {
	return this.id;
}

Card.prototype.getTitle = function() {
	return this.title;
}

Card.prototype.getContent = function() {
	return this.content;
}

Card.prototype.getType = function() {
	return this.type;
}

Card.prototype.getTop = function() {
	return this.top;
}

Card.prototype.getLeft = function() {
	return this.left;
}

Card.prototype.getCreator = function() {
	return this.creator;
}

Card.prototype.getRelatedTo = function() {
	return this.relatedTo;
}

Card.prototype.isUserCreator = function(user) {
	return this.creator.getId() == user.getId();
}
