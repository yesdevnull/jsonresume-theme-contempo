var fs = require("fs");
var Handlebars = require("handlebars");
var moment = require("moment");
var _ = require("underscore");

// From http://stackoverflow.com/a/16315366/3353747
Handlebars.registerHelper('ifCond', function(cond1, operator, cond2, options) {
	switch (operator) {
		case '==' :
			return (cond1 == cond2) ? options.fn(this) : options.inverse(this);
		break;

		case '&&' :
			return (cond1 && cond2) ? options.fn(this) : options.inverse(this);
		break;

		case '||' :
			return (cond1 || cond2) ? options.fn(this) : options.inverse(this);
		break;
	}
});

function render(resume) {
	var css = fs.readFileSync(__dirname + "/style.css", "utf-8");
	var tpl = fs.readFileSync(__dirname + "/resume.hbs", "utf-8");

	_.each(resume.work, function(work_info) {
		var startDate = work_info.startDate && new Date(work_info.startDate),
			endDate = work_info.endDate && new Date(work_info.endDate);

		if (startDate) {
			work_info.time = moment(startDate).format('MMM YYYY');
		}

		if (endDate) {
			work_info.time = work_info.time + ' – ' + moment(endDate).format('MMM YYYY');
		}

		if (startDate && !endDate) {
			work_info.time = work_info.time + ' – Present';
		}

		if (!startDate && !endDate) {
			work_info.time = '';
		}
	});

	_.each(resume.education, function(education_info) {
		var endDate = education_info.endDate && new Date(education_info.endDate);

		education_info.completed = moment(endDate).format('MMMM YYYY');
	});

	_.each(resume.awards, function(award_info) {
		var date = award_info.date && new Date(award_info.date);

		award_info.awarded = moment(date).format('YYYY');
	});

	return Handlebars.compile(tpl)({
		css: css,
		resume: resume
	});
}

module.exports = {
	render: render
};
