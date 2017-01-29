var panelClassMappingArgumentType = {
	'contention' : 'panel panel-default',
	'reason' : 'panel panel-success',
}

var cardComponent = Vue.component('draggable-card', {
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
				}, this.card.getTitle()),
				createElement('div', {
					attrs : {
						class : 'panel-body'
					},
					style : {
						'overflow-y' : 'scroll',
						'height' : '200px'
					}
				}, this.card.getContent()),
				createElement('div', {
					attrs : {
						class : 'panel-footer'
					}
				}, 
				[
					createElement('button', {
						attrs : {
							class : 'btn btn-primary btn-xs'
						},
						on : {
							click : this.emitArgumenChange
						}
					}, 
						'Rubah'
					)
				]),
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
		}
	},
	methods : {
		emitArgumenChange : function() {
			this.$emit('change-card', { index : this.index })
		},
		dragFix : function(event, ui, scale, leftValue, topValue) {
			var changeLeft = ui.position.left - ui.originalPosition.left;
			var newLeft = ui.originalPosition.left + changeLeft / scale; 
			
			var changeTop = ui.position.top - ui.originalPosition.top; 
			var newTop = ui.originalPosition.top + changeTop / scale;
			
			ui.position.left = newLeft - leftValue;
			ui.position.top = newTop - topValue;
		}
	},
	mounted : function() {
		
		var vm = this;

		$('#' + vm.card.getId()).draggable({
			stop : function(event, ui) {
				vm.$emit('on-drag-stop', { pageY : this.style.left, pageX : this.style.top, index : vm.index });
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