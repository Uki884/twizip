import { Blob } from "blob-polyfill";
global.Blob = require("node-blob");
global.atob = require("atob");

"stream" in Blob.prototype ||
  Object.defineProperty(Blob.prototype, "stream", {
    value() {
      return new Response(this).body;
    },
  }),
  "setBigUint64" in DataView.prototype ||
    Object.defineProperty(DataView.prototype, "setBigUint64", {
      value(e, n, i) {
        const o = Number(0xffffffffn & n),
          f = Number(n >> 32n);
        this.setUint32(e + (i ? 0 : 4), o, i),
          this.setUint32(e + (i ? 4 : 0), f, i);
      },
    });
const e = (e) => new DataView(new ArrayBuffer(e)),
  n = (e) => new Uint8Array(e.buffer || e),
  i = (e) => Math.min(4294967295, Number(e)),
  o = (e) => Math.min(65535, Number(e));
function f(e, i, o) {
  if (
    (void 0 === i || i instanceof Uint8Array || (i = s(i)),
    void 0 === o || o instanceof Date || (o = new Date(o)),
    e instanceof File)
  )
    return {
      i: i || s(e.name),
      o: o || new Date(e.lastModified),
      A: e.stream(),
    };
  if (e instanceof Response) {
    const n = e.headers.get("content-disposition"),
      f = n && n.match(/;\s*filename\*?=["']?(.*?)["']?$/i),
      a = (f && f[1]) || new URL(e.url).pathname.split("/").pop(),
      r = a && decodeURIComponent(a);
    return {
      i: i || s(r),
      o: o || new Date(e.headers.get("Last-Modified") || Date.now()),
      A: e.body,
    };
  }
  if (!i || 0 === i.length) throw new Error("The file must have a name.");
  if (void 0 === o) o = new Date();
  else if (isNaN(o)) throw new Error("Invalid modification date.");
  if ("string" == typeof e) return { i, o, A: s(e) };
  if (e instanceof Blob) return { i, o, A: e.stream() };
  if (e instanceof Uint8Array || e instanceof ReadableStream)
    return { i, o, A: e };
  if (e instanceof ArrayBuffer || ArrayBuffer.isView(e))
    return { i, o, A: n(e) };
  if (Symbol.asyncIterator in e) return { i, o, A: a(e) };
  throw new TypeError("Unsupported input format.");
}
function a(e) {
  const n = "next" in e ? e : e[Symbol.asyncIterator]();
  return new ReadableStream({
    async pull(e) {
      let i = 0;
      for (; e.desiredSize > i; ) {
        const o = await n.next();
        if (!o.value) {
          e.close();
          break;
        }
        {
          const n = r(o.value);
          e.enqueue(n), (i += n.byteLength);
        }
      }
    },
  });
}
function r(e: any) {
  return "string" == typeof e ? s(e) : e instanceof Uint8Array ? e : n(e);
}
function s(e: any) {
  return new TextEncoder().encode(String(e));
}
const A = new WebAssembly.Instance(
    new WebAssembly.Module(
      Uint8Array.from(
        atob(
          "AGFzbQEAAAABCgJgAABgAn9/AXwDAwIAAQUDAQACBw0DAW0CAAF0AAABYwABCpUBAkkBA38DQCABIQBBACECA0AgAEEBdiAAQQFxQaCG4u1+bHMhACACQQFqIgJBCEcNAAsgAUECdCAANgIAIAFBAWoiAUGAAkcNAAsLSQEBfyABQX9zIQFBgIAEIQJBgIAEIABqIQADQCABQf8BcSACLQAAc0ECdCgCACABQQh2cyEBIAJBAWoiAiAASQ0ACyABQX9zuAs"
        ),
        (e) => e.charCodeAt(0)
      )
    )
  ),
  { t, c, m } = A.exports;
t();
const d = n(m).subarray(65536);
function u(e, n = 0) {
  for (const i of (function* (e) {
    for (; e.length > 65536; )
      yield e.subarray(0, 65536), (e = e.subarray(65536));
    e.length && (yield e);
  })(e))
    d.set(i), (n = c(i.length, n));
  return n;
}
function y(e, n, i = 0) {
  const o =
      (e.getSeconds() >> 1) | (e.getMinutes() << 5) | (e.getHours() << 11),
    f =
      e.getDate() | ((e.getMonth() + 1) << 5) | ((e.getFullYear() - 1980) << 9);
  n.setUint16(i, o, 1), n.setUint16(i + 2, f, 1);
}
function l(i) {
  const o = e(30);
  return (
    o.setUint32(0, 1347093252),
    o.setUint32(4, 754976768),
    y(i.o, o, 10),
    o.setUint16(26, i.i.length, 1),
    n(o)
  );
}
async function* B(e) {
  let { A: n } = e;
  if (("then" in n && (n = await n), n instanceof Uint8Array))
    yield n, (e.u = u(n, 0)), (e.l = BigInt(n.length));
  else {
    e.l = 0n;
    const i = n.getReader();
    for (;;) {
      const { value: n, done: o } = await i.read();
      if (o) break;
      (e.u = u(n, e.u)), (e.l += BigInt(n.length)), yield n;
    }
  }
}
function w(o, f) {
  const a = e(16 + (f ? 8 : 0));
  return (
    a.setUint32(0, 1347094280),
    a.setUint32(4, o.u, 1),
    f
      ? (a.setBigUint64(8, o.l, 1), a.setBigUint64(16, o.l, 1))
      : (a.setUint32(8, i(o.l), 1), a.setUint32(12, i(o.l), 1)),
    n(a)
  );
}
function b(o, f, a) {
  const r = e(46);
  return (
    r.setUint32(0, 1347092738),
    r.setUint32(4, 755182848),
    r.setUint16(8, 2048),
    y(o.o, r, 12),
    r.setUint32(16, o.u, 1),
    r.setUint32(20, i(o.l), 1),
    r.setUint32(24, i(o.l), 1),
    r.setUint16(28, o.i.length, 1),
    r.setUint16(30, a ? 28 : 0, 1),
    r.setUint16(40, 33204, 1),
    r.setUint32(42, i(f), 1),
    n(r)
  );
}
function C(i, o) {
  const f = e(28);
  return (
    f.setUint16(0, 1, 1),
    f.setUint16(2, 24, 1),
    f.setBigUint64(4, i.l, 1),
    f.setBigUint64(12, i.l, 1),
    f.setBigUint64(20, o, 1),
    n(f)
  );
}
export const downloadZip = (r) =>
  new Response(
    a(
      (async function* (f) {
        const a = [];
        let r = 0n,
          s = 0n,
          A = 0;
        for await (const e of f) {
          yield l(e), yield e.i, yield* B(e);
          const n = e.l >= 0xffffffffn || r >= 0xffffffffn;
          yield w(e, n),
            a.push(b(e, r, n)),
            a.push(e.i),
            n && (a.push(C(e, r)), (r += 8n)),
            s++,
            (r += BigInt(46 + e.i.length) + e.l),
            A || (A = n);
        }
        let d = 0n;
        for (const e of a) yield e, (d += BigInt(e.length));
        if (A || r >= 0xffffffffn) {
          const i = e(76);
          i.setUint32(0, 1347094022),
            i.setBigUint64(4, BigInt(44), 1),
            i.setUint32(12, 755182848),
            i.setBigUint64(24, s, 1),
            i.setBigUint64(32, s, 1),
            i.setBigUint64(40, d, 1),
            i.setBigUint64(48, r, 1),
            i.setUint32(56, 1347094023),
            i.setBigUint64(64, r + d, 1),
            i.setUint32(72, 1, 1),
            yield n(i);
        }
        const u = e(22);
        u.setUint32(0, 1347093766),
          u.setUint16(8, o(s), 1),
          u.setUint16(10, o(s), 1),
          u.setUint32(12, i(d), 1),
          u.setUint32(16, i(r), 1),
          yield n(u);
      })(
        (async function* (e) {
          for await (const n of e)
            n instanceof File || n instanceof Response
              ? yield f(n)
              : yield f(n.input, n.name, n.lastModified);
        })(r)
      )
    ),
    {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment",
      },
    }
  );
