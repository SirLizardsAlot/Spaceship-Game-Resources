# DiamondFire Usage Notes

## Custom model test items

This pack includes selector files for four vanilla items so you can test the models without wiring `item_model` directly:

- `carrot_on_a_stick` with `custom_model_data` `1001` -> pulse pistol
- `warped_fungus_on_a_stick` with `custom_model_data` `1001` -> pulse rifle
- `blaze_rod` with `custom_model_data` `1001` -> scattergun
- `nether_star` with `custom_model_data` `1001` -> reactor core

Examples for 1.21 item-component syntax:

```mcfunction
/give @s carrot_on_a_stick[custom_model_data={floats:[1001]}]
/give @s warped_fungus_on_a_stick[custom_model_data={floats:[1001]}]
/give @s blaze_rod[custom_model_data={floats:[1001]}]
/give @s nether_star[custom_model_data={floats:[1001]}]
```

If DiamondFire lets you set `item_model` directly, you can bypass the selectors and use:

```mcfunction
/give @s carrot_on_a_stick[item_model="dfsp:pulse_pistol"]
/give @s warped_fungus_on_a_stick[item_model="dfsp:pulse_rifle"]
/give @s blaze_rod[item_model="dfsp:scattergun"]
/give @s nether_star[item_model="dfsp:reactor_core"]
```

## Custom sounds

Custom sound events live under the `dfsp` namespace:

- `dfsp:door_open`
- `dfsp:door_close`
- `dfsp:machine_loop`
- `dfsp:alarm`
- `dfsp:alarm_beetpro`
- `dfsp:alarm_twisted_fire`
- `dfsp:alarm_short`
- `dfsp:alarm_bermuda_eas`
- `dfsp:alarm_8foot`
- `dfsp:alarm_greece_eas`
- `dfsp:alarm_taiwan_eas`
- `dfsp:alarm_siren_type01`
- `dfsp:alarm_city`
- `dfsp:alarm_biohazard`
- `dfsp:button_press`
- `dfsp:lever_toggle`
- `dfsp:computer_beep`
- `dfsp:gun_pistol`
- `dfsp:gun_rifle`
- `dfsp:gun_scatter`
- `dfsp:airlock_cycle`

The pack now includes custom alarm clips inside `assets/dfsp/sounds/alarms/`. The non-alarm events still use the placeholder setup from the first draft and can be replaced later with your own `.ogg` files.

Alarm clips are now set up as short reusable pulses so you can replay them for as long or short as you want from DiamondFire. They are intentionally trimmed down instead of using the full source recordings.

Example:

```mcfunction
/playsound dfsp:alarm master @a ~ ~ ~ 1 1
/playsound dfsp:airlock_cycle master @a ~ ~ ~ 1 1
```

## Screen shake

The shader files are included, but vanilla Java Edition does not expose a simple `/command` that runs an arbitrary custom `post_effect` from a resource pack.

That means one of these has to happen before the shake can be used in-game:

- A client mod or plugin exposes a way to trigger `dfsp:screenshake`
- You remap an existing vanilla post effect to your shake effect and trigger that vanilla effect path
- You use a mod such as Luminance or a custom client-side integration

Treat the included shader as a ready-to-tune template, not as a fully wired trigger path.
