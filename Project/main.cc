#include "web/web.h"
#include "web/Animate.h"

#include <string>
#include <iostream>

emp::web::Document doc("target");

// inherit from emp::Web::Animate
// and expose inherited methods
class MapAnimator : public emp::web::Animate 
{
  // arena width and height
  const double width{1000};
  const double height{1000};

  // where we'll draw
  emp::web::Canvas canvas{width, height, "canvas"};
  emp::web::Input sourceFile();
  

public:
  MapAnimator() {
    // shove canvas into the div
    // along with a control butto
    sourceFile->Label("File");
    doc << canvas;
    doc << sourceFile;
  }

  // overrides base class's virtual function
  void DoFrame() override {
    canvas.Clear();
    int x = rand() % 500 + 50;
    canvas.Circle(x, 50, 20, "blue");
  }

};

int main() {
  MapAnimator animator;


  animator.Start();
  

}

