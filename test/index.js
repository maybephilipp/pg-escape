
var assert = require('assert');
var escape = require('..');

describe('escape(fmt, ...)', function(){
  describe('%s', function(){
    it('should format as a simple string', function(){
      assert.equal(escape('some %s here', 'thing'), 'some thing here');

      assert.equal(escape('some %s thing %s', 'long', 'here'), 'some long thing here');
    })
  })

  describe('%%', function(){
    it('should format as %', function(){
      assert.equal(escape('some %%', 'thing'), 'some %');
    })

    it('should not eat args', function(){
      assert.equal(escape('just %% a %s', 'test'), 'just % a test');
    })
  })

  describe('%I', function(){
    it('should format as an identifier', function(){
      assert.equal(escape('some %I', 'foo/bar/baz'), 'some "foo/bar/baz"');
    })
  })

  describe('%L', function(){
    it('should format as a literal', function(){
      assert.equal(escape('%L', "Tobi's"), "'Tobi''s'");
    })
  })

  describe('%Q', function(){
    it('should format as a dollar quoted string', function(){
      assert.match(escape('%Q', "Tobi's"), /\$[a-z]{1}\$Tobi's\$[a-z]\$/);
    })
  })
})

describe('escape.string(val)', function(){
  it('should coerce to a string', function(){
    assert.equal(escape.string(), '');
    assert.equal(escape.string(0), '0');
    assert.equal(escape.string(15), '15');
    assert.equal(escape.string('something'), 'something');
  })
})

describe('escape.dollarQuotedString(val)', function() {
  it('should coerce to a dollar quoted string', function(){
    assert.equal(escape.dollarQuotedString(), '');
    assert.match(escape.dollarQuotedString(0), /\$[a-z]{1}\$0\$[a-z]\$/);
    assert.match(escape.dollarQuotedString(15), /\$[a-z]{1}\$15\$[a-z]\$/);
    assert.match(escape.dollarQuotedString('something'), /\$[a-z]{1}\$something\$[a-z]\$/);
  })
})

describe('escape.ident(val)', function(){
  it('should quote when necessary', function(){
    assert.equal(escape.ident('foo'), 'foo');
    assert.equal(escape.ident('_foo'), '_foo');
    assert.equal(escape.ident('_foo_bar$baz'), '_foo_bar$baz');
    assert.equal(escape.ident('test.some.stuff'), '"test.some.stuff"');
    assert.equal(escape.ident('test."some".stuff'), '"test.""some"".stuff"');
    assert.equal(escape.ident('someStuff'), '"someStuff"');
  })

  it('should quote reserved words', function(){
    assert.equal(escape.ident('desc'), '"desc"');
    assert.equal(escape.ident('join'), '"join"');
    assert.equal(escape.ident('cross'), '"cross"');
  })

  it('should throw when null', function(done){
    try {
      escape.ident();
    } catch (err) {
      assert(err.message == 'identifier required');
      done();
    }
  })
})

describe('escape.literal(val)', function(){
  it('should return NULL for null', function(){
    assert.equal(escape.literal(null), 'NULL');
    assert.equal(escape.literal(undefined), 'NULL');
  })

  it('should return a tuple for arrays', function(){
    assert.equal(escape.literal(["foo", "bar", "baz' DROP TABLE foo;"]), "('foo', 'bar', 'baz'' DROP TABLE foo;')");
  })

  it('should quote', function(){
    assert.equal(escape.literal('hello world'), "'hello world'");
  })

  it('should escape quotes', function(){
    assert.equal(escape.literal("O'Reilly"), "'O''Reilly'");
  })

  it('should escape backslashes', function(){
    assert.equal(escape.literal('\\whoop\\'), "E'\\\\whoop\\\\'");
  })
})

