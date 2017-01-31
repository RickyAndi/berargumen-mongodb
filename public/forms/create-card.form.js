function CreateCardForm() {
	this.title = null;
	this.content = null;
	this.type = null
	this.related = {
		to : null,
		type : null
	};
}

CreateCardForm.prototype.setTitle = function(title) {
	this.title = title;
	return this;
}

CreateCardForm.prototype.setContent = function(content) {
	this.content = content;
	return this;
}

CreateCardForm.prototype.setType = function(type) {
	this.type = type;
	return this;
}

CreateCardForm.prototype.setType = function(type) {
	this.type = type;
	return this;
}

CreateCardForm.prototype.setRelatedTo = function(cardId) {
	this.related.to = cardId;
	return this;
}

CreateCardForm.prototype.setRelationType = function(type) {
	this.related.type = type;
	return this;
}

CreateCardForm.prototype.toPlainObject = function() {
	return {
		title : this.title,
		content :this.content,
		type : this.type,
		related : {
			to : this.related.to,
			type : this.related.type
		}
	}
}