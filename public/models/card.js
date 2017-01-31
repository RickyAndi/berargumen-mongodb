function Card() {
	this.id = null;
	this.title = null;
	this.content = null;
	this.type = null;
	this.top = null;
	this.left = null;
	this.creator = null;
	this.related = null;
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
	return this.related.getTo();
}

Card.prototype.getRelationType = function() {
	return this.related.getType();
}

Card.prototype.hasRelation = function() {
	return this.related.getTo() != null;
}

Card.prototype.setId = function(id) {
	this.id = id;
	return this;
}

Card.prototype.setTitle = function(title) {
	this.title = title;
	return this;
}

Card.prototype.setContent = function(content) {
	this.content = content;
	return this;
}

Card.prototype.setType = function(type) {
	this.type = type;
	return this;
}

Card.prototype.setTop = function(top) {
	this.top = top;
	return this;
}

Card.prototype.setLeft = function(left) {
	this.left = left
	return this;
}

Card.prototype.setCreator = function(user) {
	this.creator = user;
	return this;
}

Card.prototype.setRelation = function(relation) {
	this.related = relation;
	return this;
}

Card.prototype.isUserCreator = function(user) {
	return this.creator.getId() == user.getId();
}
