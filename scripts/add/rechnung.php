<?php
    require('../../assets/php-pdf-master/fpdf/fpdf.php');
    
    
    //ini_set('session.gc_maxlifetime', time() + (86400 * 7));
    //session_set_cookie_params(time() + (86400 * 7));
    //session_start();
    

    // Title, Filename
    $filename = "";
    $rechnungsnummer = "R-2022-031";
    $customerName = "Staat";

    // Header Stuff
    $weekNumber = "50";
    $weekStart = "12.12.2022";
    $weekEnd = "18.12.2022";
    $todaysDate = "19.12.2022";

    // Company Details
    $companyName = "Los Santos Customs";
    $companyBrand = "";
    $companyPersonA = "Kane Black";
    $companyPersonB = "Frank Faultier";
    $companyPhonenumber = "11111";

    // Table Details
    $table_header_date = "Datum";
    $table_header_customer = "Kunde/Fraktion";
    $table_header_desc = "Beschreibung";
    $table_header_price = "Betrag";

    class PDF extends FPDF{
        function Header(){
            $w = $this->w;
            $addHeight = 5;
            $imagePositionY = 10;
            $imagePositionX = ($w - 30) - $imagePositionY;
            $this->Image('../../assets/img/logo_transparent.png',$imagePositionX,2 + $addHeight,30);
            $this->SetY(2 + $addHeight);
            $this->SetX(10);
            $this->SetFont('Arial', 'B');
            $this->SetFontSize(10);
            $this->Cell(30,5,'Rechnung',0,0,'L');
            $this->SetY(8 + $addHeight);
            $this->SetX(10);
            $this->SetFont('Arial');
            $this->SetFontSize(10);
            $this->Cell(40, 5, 'Los Santos Customs', 0, 0,'L');
            $this->Ln(13);
        }
        function Footer(){
            $this->SetY(-8);
            $this->SetFont('Arial','I',8);
            $this->Cell(0,10,'Seite '.$this->PageNo().'/{nb}',0,0,'C');
        }
        function BasicTable($header, $data){
            // Header
            foreach($header as $col){
                $this->SetFillColor(42, 42, 42);
                $this->SetTextColor(255, 255, 255);
                $this->SetFontSize(9);
                $this->Cell(47.5, 5.3, $col, 0, 0, 'L', true);
            }
            $this->Ln();

            foreach($data as $row){
                $this->SetTextColor(0, 0, 0);
                $this->SetFontSize(8);
                $this->Cell(47.5, 6, $row, 1);
            }
            $this->Ln();
        }
    }

    $pdf = new PDF();
    $pdf->AliasNbPages();

    $header = array($table_header_date, $table_header_customer, $table_header_desc, $table_header_price);
    $data = array(
        "food" => "1",
        "bar" => "2",
    );

    $pdf->AddPage();
    $pdf->SetFont('Arial','',10);

    $pdf->BasicTable($header,$data);

    // generate table header

    
    // for($i=1;$i<=40;$i++){
    //     $pdf->Cell(0,5,$rechnungsnummer,0,1);
    // }

    $pdf->Output();

    // $pdf = new FPDF();
    // $pdf->AddPage();
    // $pdf->SetTitle($rechnungsnummer, true);
    // $pdf->SetFont('Helvetica');
    // $pdf->SetFontSize(10);
    // $pdf->Output();
    //$pdf->Output("D", generateFilename($customerName,$rechnungsnummer), true);

    // function generateFilename($c, $r){
    //     $e = ".pdf";
    //     $g = $c . "_" . $r . "" . $e;
    //     return $g;
    // }
?>