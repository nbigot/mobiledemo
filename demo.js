
/*
docs & demos :
http://arshaw.com/fullcalendar/
http://arshaw.com/js/fullcalendar-1.5.4/demos/agenda-views.html
*/

context = {
	currentId: null
};

pages = {
	'pageTeachers': {
		'pageListviewSelector':				'#page-teachers',
		'pageViewSelector':					'#page-teacher-view',
		'pageEditSelector':					'#page-teacher-edit',
		'pageViewFormFieldsSelectorPrefix':	'#view-teacher-',
		'init': function() {

			$( this.pageListviewSelector ).live( 'pagebeforeshow', this.pagebeforeshowListview );

			$( '#btn-add-new-teacher' ).live( 'click', function() {
				context.currentId = null;
			});
			
			// on event click on list item
			$( this.pageListviewSelector+' [data-itemId]' ).live('click', function() {
				context.currentId = $( this ).attr( 'data-itemId' );
			});
			
			$( this.pageEditSelector ).live( 'pagebeforeshow', this.pagebeforeshowEdit );
			
			$( this.pageViewSelector ).live( 'pagebeforeshow', this.pagebeforeshowView );
			
			$( '#btn-do-delete-teacher' ).live( 'click', function() {
				webservice.teacher.delete( context.currentId );
				context.currentId = null;
			});
			
			$( '#btn-save-teacher' ).live( 'click', function( event ) {
				var $this = pages.pageTeachers;
				if ( $( $this.pageEditSelector + ' form' )[0].checkValidity() == false ) {
					event.preventDefault();
					return;
				}
				
				event.preventDefault();
				var dataForm = $this.getDataFromForm();
				
				if ( context.currentId === null ) {
					context.currentId = webservice.teacher.add( dataForm );
				} else {
					webservice.teacher.set( context.currentId, dataForm );
				}
				
				$.mobile.changePage( $this.pageViewSelector );
			});
		},
		'getDataFromForm' : function() {
			var $this = pages.pageTeachers;
			var courses = [];
			$( 'input[id^=teacher-edit-courses-checkbox-]:checked' ).each( function() { 
				var courseId = $(this).attr('id');
				courseId = courseId.substring( courseId.lastIndexOf( '-' ) + 1 );
				courses.push( courseId );
			});
			var dataForm = {
				"name": $( $this.pageEditSelector + ' #name' ).val(),
				"courses": courses,
				"desc": $( $this.pageEditSelector + ' #desc' ).val(),
				"picture": $( $this.pageEditSelector + ' #picture' ).val(),
				"email": $( $this.pageEditSelector + ' #email' ).val()
			}
			
			return dataForm;
		},
		'pagebeforeshowListview' : function() {
			var $this = pages.pageTeachers;
			
			// rebuild list of teachers
			var content = '<ul data-role="listview" data-filter="true" data-filter-placeholder="Chercher une personne..." data-filter-theme="d" data-theme="d" data-divider-theme="d" data-autodividers="true">';
			var sortedArray = webservice.teacher.getidlistsortedbyname();
			var teachers = data['teachers'];
			
			for ( var index in sortedArray ) {
				var id = sortedArray[ index ];
				var teacher = teachers[ id ];
				content += '<li><a href="' + $this.pageViewSelector + '" data-itemId="'+id+'">';
				// picture
				content += '<img src="pictures/'+teacher['picture']+'" />';
				// name
				content += '<h3>'+teacher['name']+'</h3>';
				// list of courses teached
				content += '<p><strong>Enseigne : ';
				var courses = teacher['courses'];
				var cpt = courses.length;
				var i = 0;
				for ( var courseIndex in courses ) {
					var courseId = courses[ courseIndex ];
					var course = data.courses[ courseId ];
					if ( course != undefined ) {
						content += course.name;
						if ( ++i < cpt ) {
							content += ', ';
						}
					}
				}
				content += '</strong></p>';
				// description (ex: prof principal de la 4eme A)
				content += '<p>'+teacher['desc']+'</p>';
				content += '<p class="ui-li-aside"><strong>'+teacher['email']+'</strong></p>';
				content += '</a></li>';
			}
			content += '</ul>';
			
			// update hmtl content
			var page = $( $this.pageListviewSelector );
			$( $this.pageListviewSelector + ' [data-role=content]' ).html(content);
			
			page.trigger( 'pagecreate' );
		},
		'pagebeforeshowView' : function() {
			var $this = pages.pageTeachers;
			var teacher = webservice.teacher.get( context.currentId );
			
			$( $this.pageViewFormFieldsSelectorPrefix + 'name' ).html( teacher.name );
			var displayCourses = [];
			for ( var courseIndex in teacher.courses ) {
				var courseId = teacher.courses[ courseIndex ];
				displayCourses.push( data.courses[ courseId ].name );
			}
			$( $this.pageViewFormFieldsSelectorPrefix + 'courses' ).html( displayCourses.join() );
			$( $this.pageViewFormFieldsSelectorPrefix + 'desc' ).html( teacher.desc );
			$( $this.pageViewFormFieldsSelectorPrefix + 'picture' ).attr( 'src', "pictures/" + teacher.picture );
			$( $this.pageViewFormFieldsSelectorPrefix + 'email' ).html( teacher.email );
		},
		'pagebeforeshowEdit' : function() {
			var $this = pages.pageTeachers;
			
			// replace list of courses
			var allCourses = webservice.course.getall();
			var htmlAllCoursesList = '<fieldset data-role="controlgroup">';
			htmlAllCoursesList += '<legend>Mati&egrave;res:</legend>';
			for ( var courseId in allCourses ) {
				var courseName = allCourses[ courseId ].name;
				htmlAllCoursesList += '<input type="checkbox" name="teacher-edit-courses-checkbox-'+courseId+'" id="teacher-edit-courses-checkbox-'+courseId+'" class="custom" />';
				htmlAllCoursesList += '<label for="teacher-edit-courses-checkbox-'+courseId+'">'+courseName+'</label>';
			}
			htmlAllCoursesList += '</fieldset>';
			$( '#edit-teacher-courses' ).html( htmlAllCoursesList );
			
			// update hmtl content
			$( $this.pageEditSelector ).trigger( 'pagecreate' );
			
			if ( context.currentId === null ) {
				// clear form for new teacher
				$( $this.pageEditSelector + ' #name' ).val( '' );
				$( $this.pageEditSelector + ' #desc' ).val( '' );
				$( $this.pageEditSelector + ' #picture' ).val( '' );
				$( $this.pageEditSelector + ' #email' ).val( '' );

			} else {

				// fill form with data				
				var teacher = webservice.teacher.get( context.currentId );
				
				$( $this.pageEditSelector + ' #name' ).val( teacher.name );
				$( $this.pageEditSelector + ' #desc' ).val( teacher.desc );
				$( $this.pageEditSelector + ' #picture' ).val( teacher.picture );
				$( $this.pageEditSelector + ' #email' ).val( teacher.email );
				
				// check list items of courses
				for ( var courseIndex in teacher.courses ) {
					var courseId = teacher.courses[ courseIndex ];
					$( '#teacher-edit-courses-checkbox-' + courseId ).attr("checked",true).checkboxradio("refresh");
				}
			}
			
		},
	},
	'pageClassrooms': {
		'pageListviewSelector':				'#page-classrooms',
		'pageViewSelector':					'#page-classroom-view',
		'pageEditSelector':					'#page-classroom-edit',
		'pageViewFormFieldsSelectorPrefix':	'#view-classroom-',
		'init': function() {

			$( this.pageListviewSelector ).live( 'pagebeforeshow', this.pagebeforeshowListview );

			$( '#btn-add-new-classroom' ).live( 'click', function() {
				context.currentId = null;
			});
			
			// on event click on list item
			$( this.pageListviewSelector + ' [data-itemId]' ).live( 'click', function() {
				context.currentId = $( this ).attr( 'data-itemId' );
			});
			
			$( this.pageEditSelector ).live( 'pagebeforeshow', this.pagebeforeshowEdit );
			
			$( this.pageViewSelector ).live( 'pagebeforeshow', this.pagebeforeshowView );
			
			$( '#btn-do-delete-classroom' ).live( 'click', function() {
				webservice.classroom.delete( context.currentId );
				context.currentId = null;
			});
			
			$( '#btn-save-classroom' ).live( 'click', function( event ) {
				var $this = pages.pageClassrooms;
				if ( $( $this.pageEditSelector + ' form' )[0].checkValidity() == false ) {
					event.preventDefault();
					return;
				}
				
				event.preventDefault();
				var dataForm = $this.getDataFromForm();
				
				if ( context.currentId === null ) {
					context.currentId = webservice.classroom.add( dataForm );
				} else {
					webservice.classroom.set( context.currentId, dataForm );
				}
				
				$.mobile.changePage( $this.pageViewSelector );
			});
		},
		'getDataFromForm' : function() {
			var $this = pages.pageClassrooms;
			var courses = [];
			$( 'input[id^=classroom-edit-courses-checkbox-]:checked' ).each( function() { 
				var courseId = $(this).attr('id');
				courseId = courseId.substring( courseId.lastIndexOf( '-' ) + 1 );
				courses.push( courseId );
			});
			
			var dataForm = {
				"name": $( $this.pageEditSelector + ' #name' ).val(),
				"courses": courses,
				"building": $( $this.pageEditSelector + ' #building' ).val(),
				"floor": $( $this.pageEditSelector + ' #floor' ).val()
			}
			
			return dataForm;
		},
		'pagebeforeshowListview' : function() {
			var $this = pages.pageClassrooms;
			
			// rebuild list of classrooms
			var content = '<ul data-role="listview" data-filter="true" data-filter-placeholder="Chercher une salle de classe..." data-filter-theme="d" data-theme="d" data-divider-theme="d" data-autodividers="true">';
			var sortedArray = webservice.classroom.getidlistsortedbyname();
			var classrooms = data['classrooms'];

			for ( var index in sortedArray ) {
				var id = sortedArray[ index ];
				var classroom = classrooms[ id ];
				content += '<li><a href="' + $this.pageViewSelector + '" data-itemId="'+id+'">';
				// name
				content += '<h3>'+classroom['name']+'</h3>';
				// list of courses teached
				content += '<p><strong>Mati&egrave;res : ';	
				var courses = classroom['courses'];
				var cpt = courses.length;
				var i = 0;
				for ( var courseIndex in courses ) {
					var courseId = courses[ courseIndex ];
					var course = data.courses[ courseId ];
					if ( course != undefined ) {
						content += course.name;
						if ( ++i < cpt ) {
							content += ', ';
						}
					}
				}
				content += '</strong></p>';
				// building
				content += '<p>Batiment : '+classroom['building']+'</p>';
				// floor
				content += '<p>Etage : '+classroom['floor']+'</p>';
				content += '</a></li>';
			}
			content += '</ul>';
			
			// update hmtl content
			var page = $( $this.pageListviewSelector );
			$( $this.pageListviewSelector + ' [data-role=content]' ).html(content);
			
			page.trigger( 'pagecreate' );
		},
		'pagebeforeshowView' : function() {
			var $this = pages.pageClassrooms;
			var classroom = webservice.classroom.get( context.currentId );
			$( $this.pageViewFormFieldsSelectorPrefix + 'name' ).html( classroom.name );
			var displayCourses = [];
			for ( var courseIndex in classroom.courses ) {
				var courseId = classroom.courses[ courseIndex ];
				displayCourses.push( data.courses[ courseId ].name );
			}
			$( $this.pageViewFormFieldsSelectorPrefix + 'courses' ).html( displayCourses.join() );
			$( $this.pageViewFormFieldsSelectorPrefix + 'name' ).html( classroom.name );
			$( $this.pageViewFormFieldsSelectorPrefix + 'floor' ).html( classroom.floor );
			$( $this.pageViewFormFieldsSelectorPrefix + 'building' ).html( classroom.building );
		},
		'pagebeforeshowEdit' : function() {
			var $this = pages.pageClassrooms;

			// replace list of courses
			var allCourses = webservice.course.getall();
			var htmlAllCoursesList = '<fieldset data-role="controlgroup">';
			htmlAllCoursesList += '<legend>Mati&egrave;res possibles:</legend>';
			for ( var courseId in allCourses ) {
				var courseName = allCourses[ courseId ].name;
				htmlAllCoursesList += '<input type="checkbox" name="classroom-edit-courses-checkbox-'+courseId+'" id="classroom-edit-courses-checkbox-'+courseId+'" class="custom" />';
				htmlAllCoursesList += '<label for="classroom-edit-courses-checkbox-'+courseId+'">'+courseName+'</label>';
			}
			htmlAllCoursesList += '</fieldset>';
			$( '#edit-classroom-courses' ).html( htmlAllCoursesList );
			
			// update hmtl content
			$( $this.pageEditSelector ).trigger( 'pagecreate' );
			
			if ( context.currentId === null ) {
				// clear form for new classroom
				$( $this.pageEditSelector + ' #name' ).val( '' );
				$( $this.pageEditSelector + ' #courses' ).val( '' );
				$( $this.pageEditSelector + ' #floor' ).val( '' );
				$( $this.pageEditSelector + ' #building' ).val( '' );

			} else {

				// fill form with data				
				var classroom = webservice.classroom.get( context.currentId );
				
				$( $this.pageEditSelector + ' #name' ).val( classroom.name );
				$( $this.pageEditSelector + ' #courses' ).val( classroom.courses );
				$( $this.pageEditSelector + ' #floor' ).val( classroom.floor );
				$( $this.pageEditSelector + ' #building' ).val( classroom.building );
				
				// check list items of courses
				for ( var courseIndex in classroom.courses ) {
					var courseId = classroom.courses[ courseIndex ];
					$( '#classroom-edit-courses-checkbox-' + courseId ).attr("checked",true).checkboxradio("refresh");
				}
			}
		},
	},
	'pageSchoolclasses': {
		'pageListviewSelector':				'#page-schoolclasses',
		'pageViewSelector':					'#page-schoolclass-view',
		'pageEditSelector':					'#page-schoolclass-edit',
		'pageViewFormFieldsSelectorPrefix':	'#view-schoolclass-',
		'init': function() {

			$( this.pageListviewSelector ).live( 'pagebeforeshow', this.pagebeforeshowListview );

			$( '#btn-add-new-schoolclass' ).live( 'click', function() {
				context.currentId = null;
			});
			
			// on event click on list item
			$( this.pageListviewSelector + ' [data-itemId]' ).live( 'click', function() {
				context.currentId = $( this ).attr( 'data-itemId' );
			});
			
			$( this.pageEditSelector ).live( 'pagebeforeshow', this.pagebeforeshowEdit );
			
			$( this.pageViewSelector ).live( 'pagebeforeshow', this.pagebeforeshowView );
			
			$( '#btn-do-delete-schoolclass' ).live( 'click', function() {
				webservice.schoolclass.delete( context.currentId );
				context.currentId = null;
			});
			
			$( '#btn-save-schoolclass' ).live( 'click', function( event ) {
				var $this = pages.pageSchoolclasses;
				if ( $( $this.pageEditSelector + ' form' )[0].checkValidity() == false ) {
					event.preventDefault();
					return;
				}
				
				event.preventDefault();
				var dataForm = $this.getDataFromForm();
				
				if ( context.currentId === null ) {
					context.currentId = webservice.schoolclass.add( dataForm );
				} else {
					webservice.schoolclass.set( context.currentId, dataForm );
				}
				
				$.mobile.changePage( $this.pageViewSelector );
			});
		},
		'getDataFromForm' : function() {
			var $this = pages.pageSchoolclasses;
			var dataForm = {
				"name": $( $this.pageEditSelector + ' #name' ).val(),
				"leadteacher": $( '#schoolclass-edit-select-leadteacher' ).val(),
				"nbstudents": $( $this.pageEditSelector + ' #nbstudents' ).val(),
			}
			
			return dataForm;
		},
		'pagebeforeshowListview' : function() {
			var $this = pages.pageSchoolclasses;
			
			// rebuild list of schoolclass
			var content = '<ul data-role="listview" data-filter="true" data-filter-placeholder="Chercher une classe..." data-filter-theme="d" data-theme="d" data-divider-theme="d" data-autodividers="true">';
			var sortedArray = webservice.schoolclass.getidlistsortedbyname();
			var schoolclasses = data['schoolclasses'];

			for ( var index in sortedArray ) {
				var id = sortedArray[ index ];
				var schoolclass = schoolclasses[ id ];
				content += '<li><a href="' + $this.pageViewSelector + '" data-itemId="'+id+'">';
				// name
				content += '<h3>'+schoolclass['name']+'</h3>';
				// nb of students
				content += '<p>Nombre d\'&eacute;l&egrave;ves : '+schoolclass['nbstudents']+'</p>';
				// lead teacher
				var leadteacherId = schoolclass['leadteacher'];
				var leadteacherNameDisplay = webservice.teacher.get( leadteacherId ).name;
				content += '<p>Professeur principal : '+leadteacherNameDisplay+'</p>';
				content += '</a></li>';
			}
			content += '</ul>';
			
			// update hmtl content
			var page = $( $this.pageListviewSelector );
			$( $this.pageListviewSelector + ' [data-role=content]' ).html(content);
			
			page.trigger( 'pagecreate' );
		},
		'pagebeforeshowView' : function() {
			var $this = pages.pageSchoolclasses;
			var schoolclass = webservice.schoolclass.get( context.currentId );
			var leadteacherNameDisplay = webservice.teacher.get( schoolclass.leadteacher ).name;
			$( $this.pageViewFormFieldsSelectorPrefix + 'name' ).html( schoolclass.name );
			$( $this.pageViewFormFieldsSelectorPrefix + 'leadteacher' ).html( leadteacherNameDisplay );
			$( $this.pageViewFormFieldsSelectorPrefix + 'nbstudents' ).html( schoolclass.nbstudents );
		},
		'pagebeforeshowEdit' : function() {
			var $this = pages.pageSchoolclasses;
			
			// lead teacher
			// replace list of teachers
			var allTeachers = webservice.teacher.getall();
			var htmlAllTeachersList = '';
			for ( var teacherId in allTeachers ) {
				var teacherName = allTeachers[ teacherId ].name;
				htmlAllTeachersList += '<option value="'+teacherId+'">'+teacherName+'</option>';
			}
			$( '#schoolclass-edit-select-leadteacher' ).html( htmlAllTeachersList );
			
			// update hmtl content
			$( $this.pageEditSelector ).trigger( 'pagecreate' );
				
			if ( context.currentId === null ) {
				// clear form for new schoolclass
				$( $this.pageEditSelector + ' #name' ).val( '' );
				$( $this.pageEditSelector + ' #leadteacher' ).val( '' );
				$( $this.pageEditSelector + ' #nbstudents' ).val( '' );

			} else {

				// fill form with data				
				var schoolclass = webservice.schoolclass.get( context.currentId );
				
				$( $this.pageEditSelector + ' #name' ).val( schoolclass.name );
				$( $this.pageEditSelector + ' #leadteacher' ).val( schoolclass.leadteacher );
				$( $this.pageEditSelector + ' #nbstudents' ).val( schoolclass.nbstudents );
				$( '#schoolclass-edit-select-leadteacher' ).val( schoolclass.leadteacher );
				$('#schoolclass-edit-select-leadteacher').selectmenu('refresh');
			}
		},
	},
	'pageCourses': {
		'pageListviewSelector':				'#page-courses',
		'pageViewSelector':					'#page-course-view',
		'pageEditSelector':					'#page-course-edit',
		'pageViewFormFieldsSelectorPrefix':	'#view-course-',
		'init': function() {

			$( this.pageListviewSelector ).live( 'pagebeforeshow', this.pagebeforeshowListview );

			$( '#btn-add-new-course' ).live( 'click', function() {
				context.currentId = null;
			});
			
			// on event click on list item
			$( this.pageListviewSelector + ' [data-itemId]' ).live( 'click', function() {
				context.currentId = $( this ).attr( 'data-itemId' );
			});
			
			$( this.pageEditSelector ).live( 'pagebeforeshow', this.pagebeforeshowEdit );
			
			$( this.pageViewSelector ).live( 'pagebeforeshow', this.pagebeforeshowView );
			
			$( '#btn-do-delete-course' ).live( 'click', function() {
				webservice.course.delete( context.currentId );
				context.currentId = null;
			});
			
			$( '#btn-save-course' ).live( 'click', function( event ) {
				var $this = pages.pageCourses;
				if ( $( $this.pageEditSelector + ' form' )[0].checkValidity() == false ) {
					event.preventDefault();
					return;
				}
				
				event.preventDefault();
				var dataForm = $this.getDataFromForm();
				
				if ( context.currentId === null ) {
					context.currentId = webservice.course.add( dataForm );
				} else {
					webservice.course.set( context.currentId, dataForm );
				}
				
				$.mobile.changePage( $this.pageViewSelector );
			});
		},
		'getDataFromForm' : function() {
			var $this = pages.pageCourses;
			var dataForm = {
				"name": $( $this.pageEditSelector + ' #name' ).val(),
			}
			
			return dataForm;
		},
		'pagebeforeshowListview' : function() {
			var $this = pages.pageCourses;
			
			// rebuild list of courses
			var content = '<ul data-role="listview" data-filter="true" data-filter-placeholder="Chercher une mati&egrave;re..." data-filter-theme="d" data-theme="d" data-divider-theme="d" data-autodividers="true">';
			var sortedArray = webservice.course.getidlistsortedbyname();
			var courses = data['courses'];

			for ( var index in sortedArray ) {
				var id = sortedArray[ index ];
				var course = courses[ id ];
				content += '<li><a href="' + $this.pageViewSelector + '" data-itemId="'+id+'">';
				// name
				content += '<h3>'+course['name']+'</h3>';
				// list of teachers
				content += '<p><strong>Professeurs : ';
				var teachers = webservice.teacher.getTeachersTeachingCourseId( id );
				var cpt = teachers.length;
				var i = 0;
				for ( var teacherIndex in teachers ) {
					var teacherId = teachers[ teacherIndex ];
					var teacher = webservice.teacher.get( teacherId );
					content += teacher.name;
					if ( ++i < cpt ) {
						content += ', ';
					}
				}
				content += '</strong></p>';
				content += '</a></li>';
			}
			content += '</ul>';
			
			// update hmtl content
			var page = $( $this.pageListviewSelector );
			$( $this.pageListviewSelector + ' [data-role=content]' ).html(content);
			
			page.trigger( 'pagecreate' );
		},
		'pagebeforeshowView' : function() {
			var $this = pages.pageCourses;
			var courseId = context.currentId;
			var course = webservice.course.get( courseId );
			var teachers = webservice.teacher.getTeachersTeachingCourseId( courseId );
			var cpt = teachers.length;
			var i = 0;
			var contentTeachersList = '';
			for ( var teacherIndex in teachers ) {
				var teacherId = teachers[ teacherIndex ];
				var teacher = webservice.teacher.get( teacherId );
				contentTeachersList += teacher.name;
				if ( ++i < cpt ) {
					contentTeachersList += ', ';
				}
			}
			
			$( $this.pageViewFormFieldsSelectorPrefix + 'name' ).html( course.name );
			$( $this.pageViewFormFieldsSelectorPrefix + 'teachers' ).html( contentTeachersList );
		},
		'pagebeforeshowEdit' : function() {
			var $this = pages.pageCourses;
			if ( context.currentId === null ) {
				// clear form for new course
				$( $this.pageEditSelector + ' #name' ).val( '' );
				$( $this.pageEditSelector + ' #teachers' ).val( '' );

			} else {

				// fill form with data				
				var course = webservice.course.get( context.currentId );
				
				$( $this.pageEditSelector + ' #name' ).val( course.name );
				$( $this.pageEditSelector + ' #teachers' ).val( course.teachers );
			}
		},
	},
};

 
 $(document).bind("mobileinit", function(){

	pages.pageTeachers.init();
	pages.pageClassrooms.init();
	pages.pageSchoolclasses.init();
	pages.pageCourses.init();
});
