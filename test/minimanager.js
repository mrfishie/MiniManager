//var expect = require('chai').expect;

var chai = require('chai');
var spies = require('chai-spies');

chai.use(spies);
var expect = chai.expect;
var MiniManager = require('../minimanager');

function DummyClass() { }
DummyClass.prototype.prop = 'bar';
DummyClass.prototype.foo = function(bar) { return bar; };

describe('Minimanager', function() {
    describe('creating an instance', function() {
        it('should have object functions', function() {
            var obj = new MiniManager({ foo: function(b) { return b; } });
            //expect(obj.foo).to.be.a('function');
            expect(obj.instance).to.have.a.property('foo')
                    .that.is.a('function');
        });
        it('should have prototype properties', function() {
            var obj = new MiniManager(new DummyClass());
            expect(obj.instance).to.have.a.property('prop');
        });
        it('should have prototype functions', function() {
            var obj = new MiniManager(new DummyClass());
            expect(obj.instance).to.have.a.property('foo')
                    .that.is.a('function');
        });
        it('should not work with a non-object', function() {
            expect(function() { return new MiniManager(1); }).to.throw(TypeError);
        });
    });
    describe('using when disabled', function() {
        it('should be disabled by default', function() {
            var obj = new MiniManager({});
            expect(obj).to.have.property('enabled', false);
        });
        it('should not run instance functions', function() {
            var spy = chai.spy();
            var obj = new MiniManager({ foo: spy });
            obj.instance.foo();
            expect(spy).to.not.have.been.called();
        });
        it('should allow access to instance properties', function() {
            var obj = new MiniManager(new DummyClass());
            expect(obj.instance).to.have.a.property('prop', 'bar');
        });
        it('should not allow setting instance properties', function() {
            var obj = new MiniManager({ foo: 'bar' });
            obj.instance.foo = 'foo';
            expect(obj.instance).to.have.a.property('foo', 'bar');
        });
        it('should have an instance disabled flag', function() {
            var obj = new MiniManager(new DummyClass());
            expect(obj.instance).to.have.a.property('__enabled', false);
        });
        it('should not allow setting of the instance disabled flag', function() {
            var obj = new MiniManager(new DummyClass());
            obj.instance.__enabled = true;
            expect(obj.instance).to.have.a.property('__enabled', false);
        });
    });
    describe('using when enabled', function() {
        it('should be enabled after calling enable', function() {
            var obj = new MiniManager({});
            obj.enable();
            expect(obj).to.have.property('enabled', true);
        });
        it('should run instance functions', function() {
            var spy = chai.spy();
            var obj = new MiniManager({ foo: spy });
            obj.enable();
            obj.instance.foo();
            expect(spy).to.have.been.called();
        });
        it('should allow access to instance properties', function() {
            var obj = new MiniManager(new DummyClass());
            obj.enable();
            expect(obj.instance).to.have.a.property('prop', 'bar');
        });
        it('should allow setting instance properties', function() {
            var obj = new MiniManager({ foo: 'bar' });
            obj.enable();
            obj.instance.foo = 'foo';
            expect(obj.instance).to.have.a.property('foo', 'foo');
        });
        it('should allow changes to propagate', function() {
            var subObj = { foo: 'bar' };
            var obj = new MiniManager(subObj);
            obj.enable();
            obj.instance.foo = 'foo';
            expect(subObj).to.have.a.property('foo', 'foo');
        });
        it('should call with the correct context', function() {
            var subObj = { foo: 'bar', func: function() { this.foo = 'foo'; } };
            var obj = new MiniManager(subObj);
            obj.enable();
            obj.instance.func();
            expect(subObj).to.have.a.property('foo', 'foo');
        });
        it('should have an instance enabled flag', function() {
            var obj = new MiniManager(new DummyClass());
            obj.enable();
            expect(obj.instance).to.have.a.property('__enabled', true);
        });
        it('should not allow setting of the instance enabled flag', function() {
            var obj = new MiniManager(new DummyClass());
            obj.enable();
            obj.instance.__enabled = false;
            expect(obj.instance).to.have.a.property('__enabled', true);
        });
        it('should be disable-able', function() {
            var obj = new MiniManager({});
            obj.enable();
            obj.disable();
            expect(obj).to.have.property('enabled', false);
        });
    });
});