# PrimaEndAbgabe
Timo Melnicki

265173

Sommersemester 2024

Kurs: Prototyping interaktiver Medien - Apps und Games

Dozent: Jirka Dell´Oro

Spiel: "Moorhuhn"

Github Pages: https://timeln.github.io/PrimaEndAbgabe/Moorhuhn/

Github Repo: https://github.com/Timeln/PrimaEndAbgabe

Designdokument: https://github.com/Timeln/PrimaEndAbgabe/blob/main/Dokumentation.pdf

How to Interact:

Nach dem Spielstart kann mit der Maustaste gezielt und mit einem Mausklick auf die Linke Maustaste, geschossen werden.
Trifft der Spieler ein Huhn erhöht sich sein Score. Bei einem Fehlschuss passiert nichts.
Schafft es ein Huhn die gesamte Strecke über den Bildschirm zu fliegen, verliert der Spieler eines seiner 3 Leben.
Bei 0 Leben endet das Spiel.

1   Units and Positions

    O ist in der Mitte der Welt, und das Spiel baut sich um den Ursprung herum auf.
    1 ist die höhe und Länge eines Chicken Körpers

2   Hierarchy

    Die Szene ist das Höchste in der Hierarchy und beinhaltet den Hintergrund.

3   Editor

    Kamera, Hintergrund und Hintergrundmusik wurden im Editor gemacht.
    Der Rest wird dynamisch erzeugt per Code.
    Für die Chicken ist das besser, da diese ständig erzeugt und zerstört werden.
    Den chickenContainer hätte man einmalig im Editor erstellen können.

4   Scriptcomponents

    ChickenHandler ist eine Scriptcomponent. 
    Sie hilft ein bisschen den Code der Main.ts übersichtlicher zu halten aber wäre nicht unbedingt nötig gewesen

5   Extend

    Chicken und Player wird extended .
    Chicken ist ein NodeSprite und hat eine StateMachine.
    Player ist ein erweitertes Mutable.
    Für Player war es definitiv nützlich, da die Attribute im Interface angezeigt werden können.

6   Sound

    Es gibt einen Sound für die Atmosphäre und einen wenn man schießt, um das Spielgefühl zu verbessern.

7   VUI

    Es werden die Leben und der Score angezeigt.

8   Event-System

    Schießen ist ein Event, das jedesmal bei einem Mausklick durchgeführt wird.

9   External Data

    Es wird die "flapForceHorizontal" und die "flapForceVertical" aus einer Externen Data gelesen.

A   Light

    War nicht nötig zu verwenden, da bei dem 2D Spiel die Materialien Leuchten.

B   Physics

    Es gibt Kolissions die ausgeschalten wurden per CollisionMask, damit die Hühnchen nciht gegeneinander fliegen.
    Es wurden Forces verwendet, um das Fliegen der Hühnchen zu simulieren

C   Net

    Nicht vorhanden.

D   State Machines

    Wurde für die Zustände des Chickens verwendet.
    Es hat den State: ALIVE (wenn es fliegt) und Dead (wenn es runterfällt)

E   Animation

    Die Chickenanimationen wurden mit Spritesheets gemacht.