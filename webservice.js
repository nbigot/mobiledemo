
webservice = {
	entity: {
		'delete': function( entityType, id ) {
			delete data[ entityType ][ id ];
		},
		'add': function( entityType, prefix, value ) {
			var id = webservice.entity.newid( entityType, prefix );
			webservice.entity.set( entityType, id, value );
			return id;
		},
		'getall': function( entityType ) {
			return data[ entityType ];
		},
		'get': function( entityType, id ) {
			return data[ entityType ][ id ];
		},
		'set': function( entityType, id, value ) {
			data[ entityType ][ id ] = value;
		},
		'newid': function( entityType, prefix ) {
			if (webservice.entity.count( entityType ) < 1 ) {
				return prefix + '01';
			} else {
				var maxId = null;
				for ( var entityId in data[ entityType ] ) {
					var pattern = new RegExp( prefix + '([0-9]+)', 'g' );
					var number = pattern.exec( entityId )[ 1 ];
					maxId = parseInt( number );
				}
				var id;
				++maxId;
				if ( maxId < 10 ) {
					id = prefix + '0' + maxId;
				} else {
					id = prefix + maxId;
				}
				return id;
			}
		},
		'count': function ( entityType ) {
			return Object.keys( data[ entityType ] ).length;
		},
		'getidlistsortedbyname': function ( entityType ) {
			var sortedArray = [];
			for ( var entityId in data[ entityType ] ) {
				sortedArray.push( entityId );
			}
			
			sortedArray.sort( function( entityId1, entityId2 ) {
					var val1 = data[ entityType ][ entityId1 ].name;
					var val2 = data[ entityType ][ entityId2 ].name;
					if (val1 == val2)
						return 0;
					if (val1 > val2)
						return 1;
					if (val1 < val2)
						return -1;
				}
			);
			
			return sortedArray;
		}
	},
	teacher: {
		'entityType': 'teachers',
		'entityIdPrefix': 'teacher',
		'delete': function( id ) {
			return webservice.entity.delete( this.entityType, id );
		},
		'add': function( value ) {
			return webservice.entity.add( this.entityType, this.entityIdPrefix, value );
		},
		'getall': function() {
			return webservice.entity.getall( this.entityType );
		},
		'get': function( id ) {
			return webservice.entity.get( this.entityType, id );
		},
		'set': function( id, value ) {
			return webservice.entity.set( this.entityType, id, value );
		},
		'newid': function() {
			return webservice.entity.newid( this.entityType, this.entityIdPrefix );
		},
		'count': function () {
			return webservice.entity.count( this.entityType );
		},
		'getidlistsortedbyname': function () {
			return webservice.entity.getidlistsortedbyname( this.entityType );
		},
		'getTeachersTeachingCourseId': function ( id ) {
			var teachers = webservice.teacher.getall();
			var filteredTeachers = [];
			for ( var teacherId in teachers ) {
				if ( teachers[ teacherId ].courses.indexOf( id ) != -1 ) {
					filteredTeachers.push( teacherId );
				}
			}
			return filteredTeachers;
		},
	},
	classroom: {
		'entityType': 'classrooms',
		'entityIdPrefix': 'classroom',
		'delete': function( id ) {
			return webservice.entity.delete( this.entityType, id );
		},
		'add': function( value ) {
			return webservice.entity.add( this.entityType, this.entityIdPrefix, value );
		},
		'getall': function() {
			return webservice.entity.getall( this.entityType );
		},
		'get': function( id ) {
			return webservice.entity.get( this.entityType, id );
		},
		'set': function( id, value ) {
			return webservice.entity.set( this.entityType, id, value );
		},
		'newid': function() {
			return webservice.entity.newid( this.entityType, this.entityIdPrefix );
		},
		'count': function () {
			return webservice.entity.count( this.entityType );
		},
		'getidlistsortedbyname': function () {
			return webservice.entity.getidlistsortedbyname( this.entityType );
		}
	},
	schoolclass: {
		'entityType': 'schoolclasses',
		'entityIdPrefix': 'schoolclass',
		'delete': function( id ) {
			return webservice.entity.delete( this.entityType, id );
		},
		'add': function( value ) {
			return webservice.entity.add( this.entityType, this.entityIdPrefix, value );
		},
		'getall': function() {
			return webservice.entity.getall( this.entityType );
		},
		'get': function( id ) {
			return webservice.entity.get( this.entityType, id );
		},
		'set': function( id, value ) {
			return webservice.entity.set( this.entityType, id, value );
		},
		'newid': function() {
			return webservice.entity.newid( this.entityType, this.entityIdPrefix );
		},
		'count': function () {
			return webservice.entity.count( this.entityType );
		},
		'getidlistsortedbyname': function () {
			return webservice.entity.getidlistsortedbyname( this.entityType );
		}
	},
	course: {
		'entityType': 'courses',
		'entityIdPrefix': 'course',
		'delete': function( id ) {
			return webservice.entity.delete( this.entityType, id );
		},
		'add': function( value ) {
			return webservice.entity.add( this.entityType, this.entityIdPrefix, value );
		},
		'getall': function() {
			return webservice.entity.getall( this.entityType );
		},
		'get': function( id ) {
			return webservice.entity.get( this.entityType, id );
		},
		'set': function( id, value ) {
			return webservice.entity.set( this.entityType, id, value );
		},
		'newid': function() {
			return webservice.entity.newid( this.entityType, this.entityIdPrefix );
		},
		'count': function () {
			return webservice.entity.count( this.entityType );
		},
		'getidlistsortedbyname': function () {
			return webservice.entity.getidlistsortedbyname( this.entityType );
		},
	},
};