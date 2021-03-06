import test from 'ava'
import sinon from 'sinon'
import proxyquire from 'proxyquire'

test.beforeEach(t => {
  const fsStub = {
    existsSync: sinon.stub(),
  }

  const util = proxyquire.noCallThru().load('../src/util', {
    fs: fsStub,
  })

  t.context = {
    util,
    fsStub,
  }
})

test.afterEach.always(() => {
  sinon.restore()
})

test('getLocalBinary should find the binary path from the local node_modules', t => {
  t.plan(1)
  const { util, fsStub } = t.context

  // arrange
  fsStub.existsSync.returns(true)
  // act
  const path = util.getLocalBinary('truff', 'project_root')
  // assert
  t.is(normalizePath(path), 'project_root/node_modules/.bin/truff')
})

test('getLocalBinary should find the binary path from the parent node_modules', t => {
  t.plan(1)
  const { util, fsStub } = t.context

  // arrange
  fsStub.existsSync.onCall(0).returns(false)
  fsStub.existsSync.onCall(1).returns(true)
  // act
  const path = util.getLocalBinary('truff', 'parent/node_modules/project_root')
  // assert
  t.is(normalizePath(path), 'parent/node_modules/.bin/truff')
})

test("getLocalBinary should find the binary path from the parent node_modules even when it's scoped", t => {
  t.plan(1)
  const { util, fsStub } = t.context

  // arrange
  fsStub.existsSync.onCall(0).returns(false)
  fsStub.existsSync.onCall(1).returns(false)
  fsStub.existsSync.onCall(2).returns(true)
  // act
  const path = util.getLocalBinary(
    'truff',
    'parent/node_modules/@scope/project_root'
  )
  // assert
  t.is(normalizePath(path), 'parent/node_modules/.bin/truff')
})

function normalizePath(path) {
  // on Windows the directory separator is '\' not '/'
  const next = path.replace(/\\/g, '/')
  return next
}
