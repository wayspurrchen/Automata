# Automata

A pixel warfare, near-zero-player game. Like Conway's Game of Life, but with violence.

![](http://i.imgur.com/6PFSSdx.gif)

See it in action at [www.automata.website](http://www.automata.website).

## Details

Automata is written in native HTML5 Canvas for high performance. Cells belong to specific "broods" (owners of cells). Every turn, all the cells execute their turns in random order which consist of two steps:

1. Check if there are enemy cells nearby. If so, fight them (50% chance of winning or losing).
2. Otherwise, try and do one of two things:
  1. Divide (duplicate) into a nearby empty cell
  2. Move into a nearby empty cell

The game continues until one cell dominates the board. You can pause gameplay and "paint" more cells by using the mouse.
