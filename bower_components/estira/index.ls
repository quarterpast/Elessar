<- (definition) ->
	| typeof define is \function and define.amd? => define [] definition
	| typeof exports is \object => module.exports = definition!
	| otherwise => @Base = definition!

return class Base
	attach = (obj, name, prop, super$, superclass$)->
		obj[name] = if typeof prop is \function then ->
			prop import {
				superclass$,
				super$: ~> super$ ...
			}
			prop ...
		else prop

	@extend = (display-name, proto = display-name)-> class extends this
			import Base

			if typeof display-name is \string
				import {display-name}

			~> @initialize ...

			initialize: ->
				if super? then super ...
				else superclass ...

			for name, prop of proto
				attach ::, name, prop, ::[name], superclass

	@meta = (meta)->
		for name, prop of meta
			attach @, name, prop, @[name], this
		return this

	initialize: ->
