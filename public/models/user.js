function User(id, name, photoUrl) {
	this.id = id;
	this.name = name;
	this.photoUrl = photoUrl;
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