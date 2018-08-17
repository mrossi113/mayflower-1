const DefaultRegistry = require("undertaker-registry");
const path = require("path");
const gulp = require("gulp");
const del = require("del");
const debug = require("gulp-debug");
const css = require("./pipelines/css");
const js = require("./pipelines/js");
const git = require("./helpers/git");
const mainBowerFiles = require("main-bower-files");
const merge = require("merge-stream");

/**
 * This is a Gulp Task Registry.
 *
 * This one is the base.  It doesn't contain any tasks itself, but
 * it contains logic we reuse across the other registries.
 */
class MayflowerTaskRegistry extends DefaultRegistry {
    constructor(config, opts) {
        super();
        this.config = config;
        this.opts = opts;
    }
    resolve() {
        if(!this.config.root) {
            throw new Error("Unable to determine root directory!");
        }
        const args = [this.config.root]
            .concat(Array.prototype.slice.call(arguments))
            .filter(path => !!path);

        return path.resolve.apply(null, args);
    }
    resolveSource(subPath) {
        if(!this.config.source) {
            throw new Error("Please set config.source");
        }
        return subPath ? path.resolve(this.config.source, subPath) : this.config.source;
    }
    getBranch(allowMissing) {
        let branch = this.branch = this.branch || this.opts.branch || git.currentBranch();
        if(!branch && !allowMissing) {
            throw new Error("No branch could be determined");
        }
        return branch;
    }
    getTag(allowMissing) {
        let tag = this.tag = this.tag || this.opts.tag || git.currentTag();
        if(!tag && !allowMissing) {
            throw new Error("No tag could be determined.");
        }
        return tag;
    }
    getMajorVersion() {
        return this.getTag().split(".").shift();
    }
    getMinorVersion() {
        return this.getTag().split(".").splice(1,1);
    }
    getCommitMessage() {
        let message = this.message = this.message || this.opts.message || git.currentMessage();
        if(!message) {
            throw new Error("No message could be determined");
        }
        return message;
    }
    debug(name) {
        return debug({title: name, showFiles: this.config.verbose});
    }
    buildCleanTask(src, name) {
        let task = () => del(src);
        task.displayName = name;
        return task;
    }
    buildCssTask(dest, name) {
        const config = this.config;
        const { minify, root, sources } = config;
        const task = () => gulp.src(sources.scss)
            .pipe(css(minify, root))
            .pipe(gulp.dest(dest))
            .pipe(this.debug(name));
        task.displayName = name;
        task.watchFiles = sources.scss;
        return task;
    }
    buildCopyAssetsTask(dest, name) {
        const self = this;
        const config = this.config;
        let task = () => {
            var images = gulp.src(config.sources.images)
                .pipe(gulp.dest(`${dest}/images`));
            var fonts = gulp.src(config.sources.fonts)
                .pipe(gulp.dest(`${dest}/fonts`));
            var data = gulp.src(config.sources.data)
                .pipe(gulp.dest(`${dest}/data`));
            var templates = gulp.src(config.sources.templates)
                .pipe(gulp.dest(`${dest}/js/templates`));
            var modernizr = gulp.src(config.sources.modernizr)
                .pipe(gulp.dest(`${dest}/js/vendor`));
            return merge(images, fonts, data, templates, modernizr)
                .pipe(self.debug(name));
        };
        task.displayName = name;
        task.watchFiles = [
            config.sources.images,
            config.sources.fonts,
            config.sources.data,
            config.sources.templates,
            config.sources.modernizr
        ]
        return task;
    }
    buildCopyPatternsTask(dest, name) {
        const config = this.config;
        let task = () => gulp.src(config.sources.patterns)
            .pipe(gulp.dest(dest))
            .pipe(this.debug(name));
        task.displayName = name;
        task.watchFiles = config.sources.patterns;
        return task;
    }
    buildJSVendorTask(dest, name) {
        const config = this.config;
        let task = () => gulp.src(mainBowerFiles({paths: config.sources.bower}))
            .pipe(js.vendor(this.config.minify))
            .pipe(gulp.dest(dest))
            .pipe(this.debug(name));
        task.displayName = name;
        return task;
    }
    buildJSCustomTask(dest, name) {
        const config = this.config;
        let task = () => gulp.src(config.sources.js)
            .pipe(js.custom(this.config.minify))
            .pipe(gulp.dest(dest))
            .pipe(this.debug(name));
        task.displayName = name;
        task.watchFiles = config.sources.js;
        return task;
    }

}

module.exports = MayflowerTaskRegistry;
