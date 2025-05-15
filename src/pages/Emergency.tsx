
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, Clock, ExternalLink, Phone } from "lucide-react";
import Header from "../components/layout/Header";


const Emergency = () => {
  return (
    <><Header /><div className="space-y-8 py-10 px-28 md:px-32">  {/* 7rem → 8rem */}
      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center space-y-4 animate-pulse-soft">
        <AlertTriangle className="h-12 w-12 mx-auto text-destructive" />
        <h1 className="text-2xl md:text-3xl font-bold text-destructive">Emergency Mental Health Resources</h1>
        <p className="text-destructive/80 max-w-2xl mx-auto">
          If you or someone you know is experiencing a mental health crisis or having thoughts of suicide,
          please reach out for help immediately using one of the resources below.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-destructive/50">
          <CardHeader className="bg-destructive/5">
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Immediate Phone Support
            </CardTitle>
            <CardDescription>24/7 Crisis Lines Available</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="border-l-4 border-destructive pl-4 py-2">
              <h3 className="font-bold text-lg">National Suicide Prevention Lifeline</h3>
              <p className="text-muted-foreground mb-2">Free and confidential support for people in distress</p>
              <Button variant="destructive" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                <a href="tel:988">Call 762-1602</a>
              </Button>
            </div>

            <div className="border-l-4 border-destructive pl-4 py-2">
              <h3 className="font-bold text-lg">Crisis Text Line</h3>
              <p className="text-muted-foreground mb-2">Text with a trained crisis counselor</p>
              <p className="font-medium">Text HOME to 741741</p>
            </div>

{/*             <div className="border-l-4 border-destructive pl-4 py-2">
              <h3 className="font-bold text-lg">Campus Security</h3>
              <p className="text-muted-foreground mb-2">Your university's emergency services</p>
              <Button variant="outline" className="w-full">
                <Phone className="mr-2 h-4 w-4" />
                <a href="tel:123-456-7890">Call Campus Security</a>
              </Button>
            </div> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Warning Signs
            </CardTitle>
            <CardDescription>
              Recognize the signs that someone may need immediate help
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Talking about suicide or wanting to die</AccordionTrigger>
                <AccordionContent>
                  Any talk about suicide, wanting to die, or feeling hopeless should be taken seriously. This includes statements like "I wish I wasn't here" or "Everyone would be better off without me."
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Increasing alcohol or drug use</AccordionTrigger>
                <AccordionContent>
                  A sudden increase in substance use, especially when combined with other warning signs, may indicate someone is trying to self-medicate severe emotional distress.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Withdrawing from friends and activities</AccordionTrigger>
                <AccordionContent>
                  When someone suddenly pulls away from friends, family, and activities they previously enjoyed, it could be a sign of severe depression or suicidal thoughts.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Aggressive or reckless behavior</AccordionTrigger>
                <AccordionContent>
                  Acting with unusual aggression, recklessness, or engaging in risky activities without concern for safety can indicate a crisis state.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Dramatic mood changes</AccordionTrigger>
                <AccordionContent>
                  Extreme mood swings or sudden shifts from deep depression to calm or even happiness can sometimes indicate a person has made a decision about suicide.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What To Do In a Crisis</CardTitle>
          <CardDescription>Steps to take when you or someone you know needs immediate help</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">1. Ensure Safety</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Stay with the person (or ask someone else to)</li>
                <li>Remove potential means of harm if possible</li>
                <li>Call emergency services if danger is imminent</li>
              </ul>
            </div>

            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">2. Connect to Help</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Call a crisis hotline with them</li>
                <li>Offer to take them to the ER or urgent care</li>
                <li>Contact campus counseling services</li>
              </ul>
            </div>

            <div className="bg-red-100 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">3. Listen & Support</h3>
              <ul className="list-disc list-inside text-sm space-y-1">
                <li>Stay calm and listen without judgment</li>
                <li>Express care and concern directly</li>
                <li>Don't promise to keep their situation secret</li>
              </ul>
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-bold text-lg mb-2">After the Immediate Crisis</h3>
            <p className="mb-4">
              Even after the immediate danger has passed, continued support is crucial. Help connect the person to ongoing resources:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Follow up regularly and check in</li>
              <li>Help them connect with a mental health professional</li>
              <li>Assist with making and keeping appointments</li>
              <li>Learn about their safety plan and how you can support it</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="bg-muted/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Remember: Taking action can save a life. You don't need to be an expert to help someone in crisis.
          </p>
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <a href="https://www.nami.org/Support-Education/Resources" target="_blank" rel="noreferrer">
              More Resources
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      </Card>
    </div></>
  );
};

export default Emergency;
