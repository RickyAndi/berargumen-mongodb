function Relation() {
	this.to = null;
	this.type = null;
}

Relation.prototype.setTo = function(cardId) {
	this.to = cardId;
	return this;
}

Relation.prototype.setType = function(type) {
	this.type = type;
	return this;
}

Relation.prototype.getTo = function() {
	return this.to;
}

Relation.prototype.getType = function() {
	return this.type;
}