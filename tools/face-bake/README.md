# Guide face repaint

Repaints the Gusion model's face texture in its own painted style, nudged toward Sahil's
features (warm skin tone, thick straight brows, dark-brown eyes, black hair).

```sh
uv venv .venv && uv pip install --python .venv/bin/python numpy==2.1.3 pillow==11.0.0
M=10_gusion_-_dimension_walker; T=$M/textures/56_Gusion_Skin10_high
.venv/bin/python tools/face-bake/paint.py $M/scene.gltf tools/face-bake src/assets/company/sahil.jpeg \
  ${T}_2_baseColor.png tools/model/source/textures/56_Gusion_Skin10_high_2_baseColor.png \
  ${T}_1_baseColor.png tools/model/source/textures/56_Gusion_Skin10_high_1_baseColor.png
# preview the face from the front:
.venv/bin/python tools/face-bake/render_front.py $M/scene.gltf tools/face-bake \
  tools/model/source/textures/56_Gusion_Skin10_high_2_baseColor.png /tmp/front.png
```

Stroke shapes (brows, lips) live in `paint_layer()`; skin tone comes from the photo's cheeks.

Then re-pack the web model:

```sh
.venv/bin/python tools/model/pack.py tools/model/source public/models/guide.glb
```
