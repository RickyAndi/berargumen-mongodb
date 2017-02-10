function User() {
	this.id = null;
	this.name = null;
	this.photoUrl = null;
}

User.prototype.getId = function() {
	return this.id;
}

User.prototype.getName = function() {
	return this.name;
}

User.prototype.getPhotoUrl = function() {
	return this.photoUrl;
}

User.prototype.setId = function(id) {
	this.id = id;
	return this;
}

User.prototype.setName = function(name) {
	this.name = name;
	return this;
}

User.prototype.setPhotoUrl = function(photoUrl) {
	this.photoUrl = photoUrl
	return this;
}

User.prototype.isLoggedIn = function() {
	return this.id != null;
}