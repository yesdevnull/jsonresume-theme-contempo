var fs = require("fs");
var Handlebars = require("handlebars");
var moment = require("moment");
var _ = require("underscore");

Handlebars.registerHelper('ifCond', function(cond1, cond2, options) {
	return (cond1 || cond2) ? options.fn(this) : options.inverse(this);
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
			work_info.time = work_info.time + ' &mdash; ' + moment(endDate).format('MMM YYYY');
		}

		if (startDate && !endDate) {
			work_info.time = work_info.time + ' &mdash; Present';
		}

		if (!startDate && !endDate) {
			work_info.time = '';
		}
	});

	return Handlebars.compile(tpl)({
		css: css,
		resume: resume
	});
}

module.exports = {
	render: render
};
