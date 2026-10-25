const defaultRule={widthOffset:100,frontHeightOffset:15,depthOffset:50,bottomWidthOffset:20};
export function cutlist(u,drawerRules){const w=+u.width,h=+u.height,d=+u.depth,t=+u.thickness,b=+u.back,q=+u.qty||1,cd=d;if(![w,h,d,t,q].every(n=>Number.isFinite(n)&&n>0)||w<=2*t||cd<=0)throw Error(`Invalid dimensions for ${u.module}.`);let parts=[];const add=(name,l,wi,th,n,material=u.material)=>{if(l<=0||wi<=0)throw Error(`Invalid ${name} size in ${u.module}.`);parts.push({name,module:u.module,code:u.code,length:Math.round(l),width:Math.round(wi),thickness:Math.round(th),quantity:n*q,material})};add('Side panel',h,cd,t,2);add('Top panel',w-2*t,cd,t,1);add('Bottom panel',w-2*t,cd,t,1);if(+u.shelves)add('Shelf',w-2*t,cd,t,+u.shelves);if(b>0&&u.backMethod!=='None')add('Back panel',h,w,b,1,u.backMaterial||u.material);if(+u.doors>0){const gaps=2,doorW=(w-2*gaps-(+u.doors-1)*gaps)/+u.doors;add('Door',h-2*gaps,doorW,t,+u.doors,u.doorMaterial||u.material)}if(Array.isArray(u.customParts))u.customParts.forEach(cp=>add(cp.name,+cp.length,+cp.width,+cp.thickness,+cp.quantity,cp.material||u.material));if(+u.drawerCount>0){const r=u.drawerRules||drawerRules[u.drawerMechanism]||defaultRule;const dw=u.drawerBoxWidth?+u.drawerBoxWidth:w-(+r.widthOffset),dh=+u.drawerHeight||180,dd=u.drawerBoxDepth?+u.drawerBoxDepth:d-(+r.depthOffset),dt=+u.drawerThickness||12,bt=+u.drawerBottomThickness||6;if(dw<=0||dd<=0||dh<=0)throw Error('Drawer dimensions must be positive.');const drawerMaterial=u.drawerMaterial||u.material;add('Drawer box front',dw,dh-(+r.frontHeightOffset),dt,+u.drawerCount,drawerMaterial);add('Drawer box back',dw,dh-(+r.frontHeightOffset),dt,+u.drawerCount,drawerMaterial);add('Drawer box side',dd,dh,dt,2*(+u.drawerCount),drawerMaterial);add('Drawer bottom',dw+(+r.bottomWidthOffset),dd,bt,+u.drawerCount,drawerMaterial);if(u.drawerFace==='Separate decorative face')add('Decorative drawer face',w-4,h/(+u.drawerCount+1)-4,t,+u.drawerCount,u.drawerMaterial||u.doorMaterial||u.material)}return parts}
export function nestParts(parts, materials, kerf = 3, trim = 10) {
  const groups = new Map();
  for (const part of parts) {
    const material = materials.find(item => item.name === part.material && +item.thickness === +part.thickness) || materials.find(item => +item.thickness === +part.thickness) || materials[0];
    if (!material) continue;
    const key = `${material.name}|${part.thickness}`;
    if (!groups.has(key)) groups.set(key, { material, thickness: part.thickness, parts: [] });
    for (let index = 0; index < +part.quantity; index++) groups.get(key).parts.push({ name: part.name, width: +part.length, height: +part.width });
  }
  return [...groups.values()].map(group => {
    const sheetW = +group.material.sheetWidth - trim * 2;
    const sheetH = +group.material.sheetLength - trim * 2;
    if (sheetW <= 0 || sheetH <= 0) throw Error('Sheet dimensions are smaller than trim allowance.');
    const sheets = [];
    const sorted = group.parts.sort((a,b) => Math.max(b.width,b.height)-Math.max(a.width,a.height));
    for (const part of sorted) {
      let placed = false;
      for (const sheet of sheets) {
        if (part.width <= sheetW-sheet.x && part.height <= sheetH-sheet.y) {
          sheet.x += part.width + kerf; sheet.rowHeight = Math.max(sheet.rowHeight,part.height); placed=true; break;
        }
        if (sheet.x > 0 && part.height <= sheetW-sheet.x && part.width <= sheetH-sheet.y) {
          sheet.x += part.height + kerf; sheet.rowHeight = Math.max(sheet.rowHeight,part.width); placed=true; break;
        }
        if (sheet.y + sheet.rowHeight + kerf + part.height <= sheetH && part.width <= sheetW) {
          sheet.y += sheet.rowHeight + kerf; sheet.x = part.width + kerf; sheet.rowHeight = part.height; placed=true; break;
        }
        if (sheet.y + sheet.rowHeight + kerf + part.width <= sheetH && part.height <= sheetW) {
          sheet.y += sheet.rowHeight + kerf; sheet.x = part.height + kerf; sheet.rowHeight = part.width; placed=true; break;
        }
      }
      if (!placed) {
        if (part.width > sheetW || part.height > sheetH) throw Error(`${part.name} does not fit the configured sheet.`);
        sheets.push({x:part.width+kerf,y:0,rowHeight:part.height});
      }
    }
    return { material:group.material.name, thickness:group.thickness, sheets:sheets.length, sheetPrice:+group.material.price||0 };
  });
}
