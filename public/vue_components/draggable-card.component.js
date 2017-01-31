var panelClassMappingArgumentType = {
	'contention' : 'panel panel-default',
	'reason' : 'panel panel-success',
	'co-reason' : 'panel panel-info',
	'objection' : 'panel panel-danger',
	'rebuttal' : 'panel panel-warning',
	'lemma' : 'panel panel-success'
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
				click : component.deleteThisCard
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
	if(!component.isUserLoggedIn()) {
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
							class : 'btn btn-success btn-xs'
						},
						on : {
							click : component.createRelatedCard.bind(null, 'co-reason')
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
					width : '200px'
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
							}, ownerBox(this, createElement)),
							createElement('div', {
								attrs : {
									class : 'pull-right'
								}
							}, [
								createElement('button', {
									attrs : {
										class : 'btn btn-info btn-xs',
										'data-toggle' : 'popover',
										'data-content' : 'Lihat isi card ini',
										'data-trigger' : 'hover',	
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
					])
				]),
				createElement('div', {
					attrs : {
						class : 'panel-body'
					},
					style : {
						'overflow-y' : 'scroll',
						'min-height' : '70px'
					}
				}, this.card.getTitle()),
				createElement('div', {
					attrs : {
						class : 'panel-footer'
					}
				}, [toolsBox(this, this.card.getType(), createElement)]),
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
		isUserOwner : function() {
			return this.user.getId() == this.card.getCreator().getId();
		},
		isUserLoggedIn : function() {
			return this.user.isLoggedIn();	
		}
	},
	mounted : function() {
		
		var vm = this;

		$('#' + vm.card.getId()).draggable({
			stop : function(event, ui) {
				vm.$emit('drag-stop', { pageY : this.style.left, pageX : this.style.top, index : vm.index });
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
				jsPlumb.connect({
				    source: $('#' + vm.card.getId()),
				    target: $('#' + vm.card.getRelatedTo()),
				    detachable: false,
				    connector: [ "Flowchart", { }, { cssClass:"labelClass" }],
				    overlays: [ 
				        ["Arrow" , { width:12, length:12, location: 1 }],
				        [ "Label", { cssClass:"labelClass" } ]
				    ],
				    paintStyle:{ stroke:"red" },
				    deleteEndpointsOnDetach:true,
				    endpoint:"Blank",
				    anchor : [ [ 0.2, 0, 0, -1 ],  [ 1, 0.2, 1, 0 ], [ 0.8, 1, 0, 1 ], [ 0, 0.8, -1, 0 ] ]
				});
			}, 1000)
		}

		$('[data-toggle="popover"]').popover({
			container: 'body'
		}); 
	},
	computed : {
		left : function() {
			return this.card.getLeft()
		},
		top : function() {
			return this.card.getTop()
		}
	}
})