var panelClassMappingArgumentType = {
	'contention' : 'panel panel-default',
	'reason' : 'panel panel-success',
	'co-reason' : 'panel panel-success',
	'objection' : 'panel panel-danger',
	'rebuttal' : 'panel panel-warning',
	'lemma' : 'panel panel-success'
}

var indonesianArgumentMappingArgumentType = {
	'contention' : 'Kesimpulan (Contention)',
	'reason' : 'Alasan (Reason)',
	'co-reason' : 'Sub Alasan (Co-Reason)',
	'objection' : 'Keberatan (Objection)',
	'rebuttal' : 'Bantahan (Rebuttal)'
}

var ownerBox = function(component, createElement) {
	if(!component.isUserOwner()) {
		return [];
	}

	return [
		createElement('button', {
			attrs : {
				class : 'btn btn-danger btn-xs',
				'data-toggle' : 'popover',
				'data-content' : 'Hapus card ini',
				'data-trigger' : 'hover',
			},
			on : {
				click : component.deleteThisCard
			}
		}, [
			createElement('i', {
				attrs : {
					class : 'glyphicon glyphicon-remove'
				}
			})
		]),
		createElement('button', {
			attrs : {
				class : 'btn btn-primary btn-xs',
				'data-toggle' : 'popover',
				'data-content' : 'Ubah card ini',
				'data-trigger' : 'hover',
			},
			on : {
				click : component.changeThisCard
			}
		}, [
			createElement('i', {
				attrs : {
					class : 'glyphicon glyphicon-pencil'
				}
			})
		])
	]
}

var toolsBox = function(component, type, createElement) {
	if(!component.isCurrentUserCollaboratorOfBoard) {
		return;
	}

	var toolsBox = {
		'contention' : function() {
			return createElement('div', {
				attrs : {
					class : 'btn-group btn-group-xs'
				}
			}, 
				[
					createElement('button', {
						attrs : {
							'data-toggle' : 'popover',
							'data-content' : 'Buat Alasan',
							'data-trigger' : 'hover',
							class : 'btn btn-success btn-xs'
						},
						on : {
							click : component.createRelatedCard.bind(null, 'reason')
						}

					}, [
						createElement('i', {
							attrs : {
								class : 'glyphicon glyphicon-ok'
							}
						})
					]),
					createElement('button', {
						attrs : {
							'data-toggle' : 'popover',
							'data-content' : 'Buat Keberatan',
							'data-trigger' : 'hover',
							class : 'btn btn-danger btn-xs'
						},
						on : {
							click : component.createRelatedCard.bind(null, 'objection') 
						}

					}, [
						createElement('i', {
							attrs : {
								class : 'glyphicon glyphicon-volume-off'
							}
						})
					]),
				]
			)
		},
		'objection' : function() {
			return createElement('div', {
				attrs : {
					class : 'btn-group btn-group-xs'
				}
			}, 
				[
					createElement('button', {
						attrs : {
							'data-toggle' : 'popover',
							'data-content' : 'Buat Alasan',
							'data-trigger' : 'hover',
							class : 'btn btn-success btn-xs'
						},
						on : {
							click : component.createRelatedCard.bind(null, 'reason')
						}

					}, [
						createElement('i', {
							attrs : {
								class : 'glyphicon glyphicon-ok'
							}
						})
					]),
					createElement('button', {
						attrs : {
							'data-toggle' : 'popover',
							'data-content' : 'Buat Bantahan',
							'data-trigger' : 'hover',
							class : 'btn btn-danger btn-xs'
						},
						on : {
							click : component.createRelatedCard.bind(null, 'rebuttal') 
						}

					}, [
						createElement('i', {
							attrs : {
								class : 'glyphicon glyphicon-volume-off'
							}
						})
					]),
				]
			)
		},
		'reason' : function() {
			return createElement('div', {
				attrs : {
					class : 'btn-group btn-group-xs'
				}
			}, 
				[
					createElement('button', {
						attrs : {
							'data-toggle' : 'popover',
							'data-content' : 'Buat Alasan',
							'data-trigger' : 'hover',
							class : 'btn btn-success btn-xs'
						},
						on : {
							click : component.createRelatedCard.bind(null, 'reason')
						}

					}, [
						createElement('i', {
							attrs : {
								class : 'glyphicon glyphicon-ok'
							}
						})
					]),
					createElement('button', {
						attrs : {
							'data-toggle' : 'popover',
							'data-content' : 'Buat Sub Alasan',
							'data-trigger' : 'hover',
							class : 'btn btn-info btn-xs'
						},
						on : {
							click : component.createRelatedCard.bind(null, 'co-reason')
						}

					}, [
						createElement('i', {
							attrs : {
								class : 'glyphicon glyphicon-zoom-in'
							}
						})
					]),
					createElement('button', {
						attrs : {
							'data-toggle' : 'popover',
							'data-content' : 'Buat Keberatan',
							'data-trigger' : 'hover',
							class : 'btn btn-danger btn-xs'
						},
						on : {
							click : component.createRelatedCard.bind(null, 'objection') 
						}

					}, [
						createElement('i', {
							attrs : {
								class : 'glyphicon glyphicon-volume-off'
							}
						})
					]),
				]
			)
		},
		'co-reason' : function() {
			return createElement('div', {
				attrs : {
					class : 'btn-group btn-group-xs'
				}
			}, 
				[
					createElement('button', {
						attrs : {
							'data-toggle' : 'popover',
							'data-content' : 'Buat Alasan',
							'data-trigger' : 'hover',
							class : 'btn btn-success btn-xs'
						},
						on : {
							click : component.createRelatedCard.bind(null, 'reason')
						}

					}, [
						createElement('i', {
							attrs : {
								class : 'glyphicon glyphicon-ok'
							}
						})
					]),
					createElement('button', {
						attrs : {
							'data-toggle' : 'popover',
							'data-content' : 'Buat Sub Alasan',
							'data-trigger' : 'hover',
							class : 'btn btn-info btn-xs'
						},
						on : {
							click : component.createRelatedCard.bind(null, 'co-reason')
						}

					}, [
						createElement('i', {
							attrs : {
								class : 'glyphicon glyphicon-zoom-in'
							}
						})
					]),
					createElement('button', {
						attrs : {
							'data-toggle' : 'popover',
							'data-content' : 'Buat Keberatan',
							'data-trigger' : 'hover',
							class : 'btn btn-danger btn-xs'
						},
						on : {
							click : component.createRelatedCard.bind(null, 'objection') 
						}

					}, [
						createElement('i', {
							attrs : {
								class : 'glyphicon glyphicon-volume-off'
							}
						})
					]),
				]
			)
		},
		'rebuttal' : function() {
			return createElement('div', {
				attrs : {
					class : 'btn-group btn-group-xs'
				}
			}, 
				[
					createElement('button', {
						attrs : {
							'data-toggle' : 'popover',
							'data-content' : 'Buat Alasan',
							'data-trigger' : 'hover',
							class : 'btn btn-success btn-xs'
						},
						on : {
							click : component.createRelatedCard.bind(null, 'reason')
						}

					}, [
						createElement('i', {
							attrs : {
								class : 'glyphicon glyphicon-ok'
							}
						})
					]),
					createElement('button', {
						attrs : {
							'data-toggle' : 'popover',
							'data-content' : 'Buat Keberatan',
							'data-trigger' : 'hover',
							class : 'btn btn-danger btn-xs'
						},
						on : {
							click : component.createRelatedCard.bind(null, 'objection') 
						}

					}, [
						createElement('i', {
							attrs : {
								class : 'glyphicon glyphicon-volume-off'
							}
						})
					]),
				]
			)
		}
	}

	return toolsBox[type]();
}

var draggableCardComponent = Vue.component('draggable-card', {
	render : function(createElement) {
		return createElement('div', {
			attrs : {
				class 	: 'card-container',
				id 		: this.card.getId(),
			},
			style : {
				'top' 	: this.top,
				'left' 	: this.left
			}
		}, 
		[
			createElement('div', { 
				attrs : {
					class : panelClassMappingArgumentType[this.card.getType()],
				},
				style : {
					width : '250px'
				}
			},
			[
				createElement('div', {
					attrs : {
						class : 'panel-heading'
					}
				}, [
					createElement('div', {
						attrs : {
							class : 'row'
						}
					}, [
						createElement('div', {
							attrs : {
								class : 'col-md-12'
							}
						}, [
							createElement('div', {
								attrs : {
									class : 'pull-left'
								}
							}, [
								createElement('h6', {}, indonesianArgumentMappingArgumentType[this.card.getType()])
							]),
							createElement('div', {
								attrs : {
									class : 'pull-right'
								}
							}, ownerBox(this, createElement))
						])
					])
				]),
				createElement('div', {
					attrs : {
						class : 'panel-body'
					},
					style : {
						'overflow-y' : 'scroll',
						'max-height' : '120px',
						'min-height' : '120px'
					}
				}, this.card.getTitle()),
				createElement('div', {
					attrs : {
						class : 'panel-footer'
					}
				}, 	[
						createElement('div', {
							attrs : {
								class : 'row'
							}
						}, 
						[
							createElement('div', {
								attrs : {
									class : 'col-md-6'
								}
							}, [toolsBox(this, this.card.getType(), createElement)]),
							createElement('div', {
								attrs : {
									class : 'col-md-6'
								}
							}, [
								createElement('button', {
									attrs : {
										class : 'btn btn-info btn-xs pull-right',
										'data-toggle' : 'popover',
										'data-content' : 'Lihat card ini secara detail',
										'data-trigger' : 'hover',	
									},
									on : {
										click : this.viewCardDetail
									}
								}, [
									createElement('i', {
										attrs : {
											class : 'glyphicon glyphicon-eye-open'
										}
									})
								])
							])
						])
					]
				),
			])
		])
	},
	props : {
		card : {
			type : Card,
			required : true
		},
		index : {
			type : Number,
			required : true
		},
		scale : {
			type : Number,
			required : true
		},
		leftsubtraction : {
			type : Number,
			required : true
		},
		topsubtraction : {
			type : Number,
			required : true
		},
		user : {
			type : User,
			required : true
		},
		isCurrentUserCollaboratorOfBoard : {
			type : Boolean,
			required : true
		},
		isUserBoardOwner : {
			type : Boolean,
			required : true
		}
	},
	methods : {
		emitCardChange : function() {
			this.$emit('change-card', { index : this.index })
		},
		dragFix : function(event, ui, scale, leftValue, topValue) {
			var changeLeft = ui.position.left - ui.originalPosition.left;
			var newLeft = ui.originalPosition.left + changeLeft / scale; 
			
			var changeTop = ui.position.top - ui.originalPosition.top; 
			var newTop = ui.originalPosition.top + changeTop / scale;
			
			ui.position.left = newLeft - leftValue;
			ui.position.top = newTop - topValue;
		},
		createRelatedCard : function(type) {
			this.$emit('create-related-card', { 
				index : this.index,
				type : type 
			});
		},
		deleteThisCard : function() {
			this.$emit('delete-card', { index : this.index })
		},
		changeThisCard : function() {
			this.$emit('change-card', { index : this.index })	
		},
		isUserOwner : function() {
			return this.user.getId() == this.card.getCreator().getId();
		},
		isUserLoggedIn : function() {
			return this.user.isLoggedIn();	
		},
		viewCardDetail : function() {
			window.open('/card/' + this.card.getId());
		}
	},
	mounted : function() {
		
		var vm = this;

		$('#' + vm.card.getId()).draggable({
			containment : 'parent',
			stop : function(event, ui) {
				if(vm.isUserOwner() || vm.isUserBoardOwner) {
					vm.$emit('drag-stop', { pageY : this.style.left, pageX : this.style.top, index : vm.index });
				}
			},
			drag : function(event, ui) {
				vm.dragFix(event, ui, vm.scale, vm.leftsubtraction, vm.topsubtraction);
				jsPlumb.repaintEverything();
			},
			start : function(event, ui) {
				ui.position.left = 0;
				ui.position.top = 0;
			}
		});

		if(vm.card.hasRelation()) {
			setTimeout(function() {
					
					var source = vm.card.getRelatedTo();

					if(!$('#' + source).length) {
						return;
					}

					var connectionDataMapping = {
						'reason' : {
							'labelContent' : 'Karena',
							'connectionColor' : '#22BE34',
							'cssClass' : 'label-reason'
						},
						'co-reason' : {
							'labelContent' : 'Dan',
							'connectionColor' : '#22BE34',
							'cssClass' : 'label-co-reason'
						},
						'objection' : {
							'labelContent' : 'Tetapi',
							'connectionColor' : '#D01919',
							'cssClass' : 'label-objection'
						},
						'rebuttal' : {
							'labelContent' : 'Tetapi',
							'connectionColor' : '#FF851B',
							'cssClass' : 'label-rebuttal'	
						},
					}

					var target = vm.card.getId();
					var relationType = vm.card.getRelationType();

					if(relationType == 'co-reason') {

						var connection_1 = jsPlumb.connect({
						    source: $('#' + source),
						    target: $('#' + target),
							detachable: false,
							connector: ["Flowchart"],
							overlays: [ 
							    ["Arrow", { 
							    	width:12, 
							    	length:12, 
							    	location: 1 
							    }],
							    ["Label", { 
							    	label : connectionDataMapping[relationType]['labelContent'],
							    	cssClass: connectionDataMapping[relationType]['cssClass']
							    }]
							],
							paintStyle:{ stroke: connectionDataMapping[relationType]['connectionColor'], strokeWidth:2 },
							deleteEndpointsOnDetach:true,
							endpoint:"Blank",
							anchor : [
								[ 0.2, 0, 0, -1], 
								[ 1, 0.2, 1, 0],
								[ 0.8, 1, 0, 1],
								[ 0, 0.8, -1, 0]
							]
						});

						var connection_2 = jsPlumb.connect({
						    source: $('#' + target),
						    target: $('#' + source),
							detachable: false,
							connector: ["Flowchart"],
							overlays: [ 
							    ["Arrow", { 
							    	width:12, 
							    	length:12, 
							    	location: 1 
							    }]
							],
							paintStyle:{ stroke: connectionDataMapping[relationType]['connectionColor'], strokeWidth:2 },
							deleteEndpointsOnDetach:true,
							endpoint:"Blank",
							anchor : [
								[ 0.2, 0, 0, -1], 
								[ 1, 0.2, 1, 0],
								[ 0.8, 1, 0, 1],
								[ 0, 0.8, -1, 0]
							]
						});

						var connectionToBeEmittedToParent1 = {
							source : source,
							target : target,
							connection : connection_1
						};

						var connectionToBeEmittedToParent2 = {
							source : source,
							target : target,
							connection : connection_2
						};

						vm.$emit('connection-created', connectionToBeEmittedToParent1);
						vm.$emit('connection-created', connectionToBeEmittedToParent2);

					} else {
						var connection = jsPlumb.connect({
						    source: $('#' + source),
						    target: $('#' + target),
							detachable: false,
							connector: ["Flowchart"],
							overlays: [ 
							    ["Arrow", { 
							    	width:12, 
							    	length:12, 
							    	location: 1 
							    }],
							    ["Label", { 
							    	label : connectionDataMapping[relationType]['labelContent'],
							    	cssClass: connectionDataMapping[relationType]['cssClass']
							    }]
							],
							paintStyle:{ stroke: connectionDataMapping[relationType]['connectionColor'], strokeWidth:2 },
							deleteEndpointsOnDetach:true,
							endpoint:"Blank",
							anchor : [
								[ 0.2, 0, 0, -1], 
								[ 1, 0.2, 1, 0],
								[ 0.8, 1, 0, 1],
								[ 0, 0.8, -1, 0]
							]
						});

						var connectionToBeEmittedToParent = {
							source : source,
							target : target,
							connection : connection
						}

						vm.$emit('connection-created', connectionToBeEmittedToParent);
					}
			}, 1000);
		}

		setTimeout(function() {
			$('[data-toggle="popover"]').popover({
				container: 'body'
			}); 
		}, 1000)
		
	},
	computed : {
		left : function() {
			return this.card.getLeft()
		},
		top : function() {
			return this.card.getTop()
		},
	}
})